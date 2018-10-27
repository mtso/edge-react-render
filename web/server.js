const express = require('express')
const fs = require('fs')
const path = require('path')

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist/manifest.json')).toString())
const manifestRender = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist/manifest-render.json')).toString())

const app = express()

app.set('view engine', 'ejs')
app.use('/static', express.static('dist'))

app.get('/', (req, res) => {
  res.render('app', {
    renderPath: '/static/' + manifestRender['render.js'],
    bundlePath: '/static/' + manifest['bundle.js'],
    title: 'Sample Website',
    initialState: {
      name: 'state world name'
    },
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${listener.address().port}`)
})
