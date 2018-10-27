# Edge React Render

Example implementation of React server-side rendering on the edge using the Fly runtime.

## Advantages

- The app's preloaded JSON state (e.g. passed to redux) can be rendered on a server that does not understand React or include the V8 engine.

## Limitations

- Component constructors and `componentWillMount` cannot use the browser or node.js APIs.

## How it Works

(to be written)

## Running

First run web server, then run the edge app on a local Fly runtime.

### Running the web server

Defaults to listening on port 3000.

```
cd web
npm install
npm start
```

### Running the edge app

The Fly runtime uses `.fly.yml` for configuration. This edge app uses `hostname`,
which is expected to point to the web server. For example, if the web server is
started on `localhost:3000`, then the `.fly.yml` configuration for hostname should
be `- hostname: http://localhost:3000`. Note: installing `@fly/fly` will take some
time because of post-install compilation tasks.

```
cd edge
npm install
npm start
```

The Fly runtime will automatically look for a port to bind to.
The console output will show where the server is listening.

## Structure

```
edge/ Fly app that fronts the web server.
web/ Sample web app that pre renders React app and returns HTML.
|- app/ React app.
```
