// const cheerio = require('cheerio')
import cheerio from 'cheerio'
import cache from '@fly/cache'

module.exports = async (req) => {
  const hostname = app.config.hostname

  const requestUrl = new URL(req.url)
  const proxyEndpoint = new URL(hostname)
  // fly.log('info', proxyEndpoint.pathname)
  proxyEndpoint.pathname = requestUrl.pathname

  const breq = req.clone()
  breq.url = proxyEndpoint.toString()
  breq.headers = new Headers({
    origin: hostname,
  })

  // fly.log('info', new URL(req.url))

  return fetch(breq)
    .then((resp) => {
      // Pass /static/ and /api paths through/
      if (/(^\/static\/|^\/api)/.test(requestUrl.pathname)) {
        return resp
      } else {
        // Assume we need to render the app
        return renderResponseApp(hostname, resp) 
      }
    })
    .catch((err) => {
      return new Response(err.message)
    })
}

// https://github.com/jessetane/array-buffer-concat/blob/master/index.js
function arrayBufferConcat () {
  var length = 0
  var buffer = null

  for (var i in arguments) {
    buffer = arguments[i]
    length += buffer.byteLength
  }

  var joined = new Uint8Array(length)
  var offset = 0

  for (var i in arguments) {
    buffer = arguments[i]
    joined.set(new Uint8Array(buffer), offset)
    offset += buffer.byteLength
  }

  return joined.buffer
}

async function renderResponseApp(hostname, resp) {
  const html = await arrayBufferStreamToString(resp.body)

  const $ = cheerio.load(html)

  const appRenderModulePath = $('meta[name=react_render_bundle]').attr('content')
  const appRootSelector = $('meta[name=react_app_root_selector]').attr('content')
  const appInitialState = JSON.parse(
    $('meta[name="react_app_initial_state"]').attr('content')
  )

  fly.log('info', `appRenderModulePath=${appRenderModulePath}`)
  fly.log('info', `appRootSelector=${appRootSelector}`)
  fly.log('info', `appInitialState=${JSON.stringify(appInitialState)}`)

  const moduleString = await getRenderModuleString(hostname, appRenderModulePath)
  fly.log('info', `moduleString=${moduleString.slice(0, 100)}`)

  const renderModule = eval(moduleString)
  // assuming renderModule's exported function has the signature:
  // fn (initialState: object) -> String
  const markup = evaluateModuleFunction(renderModule, appInitialState)
  fly.log('info', `markup=${markup.slice(0, 100)}`)

  $('head').append('<meta name="edge_app_rendered" content="true">')
  $(appRootSelector).html(markup)
  
  return new Response($.html())
}

async function arrayBufferStreamToString(readableStream, encoding) {
  async function readAllChunks(readableStream) {
    const reader = readableStream.getReader()
    const chunks = []
  
    return await pump()
  
    async function pump() {
      const data = await reader.read()
      if (data.done) {
        return chunks
      } else {
        chunks.push(data.value)
        return await pump()
      }
    }
  }

  const chunks = await readAllChunks(readableStream)
  const arrayBuffer = arrayBufferConcat.apply(null, chunks)
  return Buffer.from(arrayBuffer).toString(encoding)
}

/**
 * Fetch render module's source string from cache or web server.
 * @param {String} hostname module source URL hostname
 * @param {String} path module source URL path (should contain unique hash for caching)
 */
async function getRenderModuleString(hostname, path) {
  // throw new Error(hostname + path)
  try {
    const moduleString = await cache.getString(path)
    if (moduleString) { return moduleString }
  } catch (err) {
    // TODO: retry?
    throw err
  }

  const moduleResp = await fetch(hostname + path)
  const moduleString = await arrayBufferStreamToString(moduleResp.body)
  try {
    await cache.set(path, moduleString)
  } catch (err) {
    // TODO: retry?
    throw err
  }
  return moduleString
}

/**
 * Tries to evaluate a function exported in the given module object.
 */
function evaluateModuleFunction(module) /* throws */ {
  const rest = Array.prototype.slice.call(arguments).slice(1)
  if (typeof module === 'function') {
    return module.apply(null, rest)
  } else if (typeof module === 'object') {
    if ('default' in module) {
      return module.default.apply(null, rest)

    // Try to evaluate if there is only one exported function.
    // TODO: Make this smarter? Regex keys against "render" maybe?
    } else if (Object.keys(module).length === 1) {
      for (let func in module) {
        return func.apply(null, rest)
      }
    }
  }
  throw new Error('Exported function not found')
}
