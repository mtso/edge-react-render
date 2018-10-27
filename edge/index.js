require('@babel/polyfill')
const handler = require('./lib/handler')

fly.http.respondWith(handler)
