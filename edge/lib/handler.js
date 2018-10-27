"use strict";

var _cheerio = _interopRequireDefault(require("cheerio"));

var _cache = _interopRequireDefault(require("@fly/cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

module.exports =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req) {
    var hostname, requestUrl, proxyEndpoint, breq;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            hostname = app.config.hostname;
            requestUrl = new URL(req.url);
            proxyEndpoint = new URL(hostname); // fly.log('info', proxyEndpoint.pathname)

            proxyEndpoint.pathname = requestUrl.pathname;
            breq = req.clone();
            breq.url = proxyEndpoint.toString();
            breq.headers = new Headers({
              origin: hostname
            }); // fly.log('info', new URL(req.url))

            return _context.abrupt("return", fetch(breq).then(function (resp) {
              // Pass /static/ and /api paths through/
              if (/(^\/static\/|^\/api)/.test(requestUrl.pathname)) {
                return resp;
              } else {
                // Assume we need to render the app
                return renderResponseApp(hostname, resp);
              }
            }).catch(function (err) {
              return new Response(err.message);
            }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); // https://github.com/jessetane/array-buffer-concat/blob/master/index.js


function arrayBufferConcat() {
  var length = 0;
  var buffer = null;

  for (var i in arguments) {
    buffer = arguments[i];
    length += buffer.byteLength;
  }

  var joined = new Uint8Array(length);
  var offset = 0;

  for (var i in arguments) {
    buffer = arguments[i];
    joined.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return joined.buffer;
}

function renderResponseApp(_x2, _x3) {
  return _renderResponseApp.apply(this, arguments);
}

function _renderResponseApp() {
  _renderResponseApp = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(hostname, resp) {
    var html, $, appRenderModulePath, appRootSelector, appInitialState, moduleString, renderModule, markup;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return arrayBufferStreamToString(resp.body);

          case 2:
            html = _context2.sent;
            $ = _cheerio.default.load(html); // const $meta = $('meta')
            // Object.keys($meta).forEach((key) => fly.log('info', $meta[key]))
            // fly.log('info', $('meta[name=react_render_bundle]').html())

            appRenderModulePath = $('meta[name=react_render_bundle]').attr('content');
            appRootSelector = $('meta[name=react_app_root_selector]').attr('content');
            appInitialState = JSON.parse($('meta[name="react_app_initial_state"]').attr('content'));
            fly.log('info', "appRenderModulePath=".concat(appRenderModulePath));
            fly.log('info', "appRootSelector=".concat(appRootSelector));
            fly.log('info', "appInitialState=".concat(JSON.stringify(appInitialState)));
            _context2.next = 12;
            return getRenderModuleString(hostname, appRenderModulePath);

          case 12:
            moduleString = _context2.sent;
            fly.log('info', "moduleString=".concat(moduleString.slice(0, 100)));
            renderModule = eval(moduleString); // assuming renderModule's exported function has the signature:
            // fn (initialState: object) -> String

            markup = evaluateModuleFunction(renderModule, appInitialState);
            fly.log('info', "markup=".concat(markup.slice(0, 100)));
            $('head').append('<meta name="edge_app_rendered" content="true">');
            $(appRootSelector).html(markup);
            return _context2.abrupt("return", new Response($.html()));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _renderResponseApp.apply(this, arguments);
}

function arrayBufferStreamToString(_x4, _x5) {
  return _arrayBufferStreamToString.apply(this, arguments);
}
/**
 * Fetch render module's source string from cache or web server.
 * @param {String} hostname module source URL hostname
 * @param {String} path module source URL path (should contain unique hash for caching)
 */


function _arrayBufferStreamToString() {
  _arrayBufferStreamToString = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(readableStream, encoding) {
    var readAllChunks, _readAllChunks, chunks, arrayBuffer;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _readAllChunks = function _ref5() {
              _readAllChunks = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4(readableStream) {
                var reader, chunks, pump, _pump;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _pump = function _ref3() {
                          _pump = _asyncToGenerator(
                          /*#__PURE__*/
                          regeneratorRuntime.mark(function _callee3() {
                            var data;
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return reader.read();

                                  case 2:
                                    data = _context3.sent;

                                    if (!data.done) {
                                      _context3.next = 7;
                                      break;
                                    }

                                    return _context3.abrupt("return", chunks);

                                  case 7:
                                    chunks.push(data.value);
                                    _context3.next = 10;
                                    return pump();

                                  case 10:
                                    return _context3.abrupt("return", _context3.sent);

                                  case 11:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3, this);
                          }));
                          return _pump.apply(this, arguments);
                        };

                        pump = function _ref2() {
                          return _pump.apply(this, arguments);
                        };

                        reader = readableStream.getReader();
                        chunks = [];
                        _context4.next = 6;
                        return pump();

                      case 6:
                        return _context4.abrupt("return", _context4.sent);

                      case 7:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              }));
              return _readAllChunks.apply(this, arguments);
            };

            readAllChunks = function _ref4(_x8) {
              return _readAllChunks.apply(this, arguments);
            };

            _context5.next = 4;
            return readAllChunks(readableStream);

          case 4:
            chunks = _context5.sent;
            arrayBuffer = arrayBufferConcat.apply(null, chunks);
            return _context5.abrupt("return", Buffer.from(arrayBuffer).toString(encoding));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _arrayBufferStreamToString.apply(this, arguments);
}

function getRenderModuleString(_x6, _x7) {
  return _getRenderModuleString.apply(this, arguments);
}
/**
 * Tries to evaluate a function exported in the given module object.
 */


function _getRenderModuleString() {
  _getRenderModuleString = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(hostname, path) {
    var _moduleString, moduleResp, moduleString;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _cache.default.getString(path);

          case 3:
            _moduleString = _context6.sent;

            if (!_moduleString) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", _moduleString);

          case 6:
            _context6.next = 11;
            break;

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            throw _context6.t0;

          case 11:
            _context6.next = 13;
            return fetch(hostname + path);

          case 13:
            moduleResp = _context6.sent;
            _context6.next = 16;
            return arrayBufferStreamToString(moduleResp.body);

          case 16:
            moduleString = _context6.sent;
            _context6.prev = 17;
            _context6.next = 20;
            return _cache.default.set(path, moduleString);

          case 20:
            _context6.next = 25;
            break;

          case 22:
            _context6.prev = 22;
            _context6.t1 = _context6["catch"](17);
            throw _context6.t1;

          case 25:
            return _context6.abrupt("return", moduleString);

          case 26:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 8], [17, 22]]);
  }));
  return _getRenderModuleString.apply(this, arguments);
}

function evaluateModuleFunction(module)
/* throws */
{
  var rest = Array.prototype.slice.call(arguments).slice(1);

  if (typeof module === 'function') {
    return module.apply(null, rest);
  } else if (_typeof(module) === 'object') {
    if ('default' in module) {
      return module.default.apply(null, rest); // Try to evaluate if there is only one exported function.
      // TODO: Make this smarter? Regex keys against "render" maybe?
    } else if (Object.keys(module).length === 1) {
      for (var func in module) {
        return func.apply(null, rest);
      }
    }
  }

  throw new Error('Exported function not found');
}