# My Framework

A lightweight Express-like framework for Node.js built from scratch.

## Features

- ✅ HTTP method routing (GET, POST, PUT, DELETE, PATCH)
- ✅ Middleware support
- ✅ Route parameters (`:id`, `:name`)
- ✅ Query string parsing
- ✅ Enhanced request/response objects
- ✅ Error handling
- ✅ Chainable API

## Installation

```bash
npm install
```

## Quick Start

```javascript
const createApp = require('./src/index');

const app = createApp();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## API Reference

### Application Methods

#### `app.use([path], handler)`
Register middleware that runs for all requests.

#### `app.get(path, ...handlers)`
Register a GET route.

#### `app.post(path, ...handlers)`
Register a POST route.

#### `app.put(path, ...handlers)`
Register a PUT route.

#### `app.delete(path, ...handlers)`
Register a DELETE route.

#### `app.listen(port, callback)`
Start the server on specified port.

### Request Object

- `req.params` - Route parameters
- `req.query` - Query string parameters
- `req.get(headerName)` - Get header value
- `req.accepts(type)` - Check accepted content type

### Response Object

- `res.status(code)` - Set status code
- `res.json(data)` - Send JSON response
- `res.send(data)` - Send response
- `res.set(field, value)` - Set header
- `res.redirect([status], url)` - Redirect to URL

## Running the Example

```bash
npm run example
```

Then visit http://localhost:3000

## Project Structure

```
framework/
├── src/
│   ├── index.js          # Main entry point
│   ├── application.js    # Application class
│   ├── router.js         # Router implementation
│   └── enhancers.js      # Request/Response enhancements
├── examples/
│   └── basic-server.js   # Example server
├── package.json
└── README.md
```

## Next Steps

Potential features to add:
- Body parsing (JSON, URL-encoded, multipart)
- Cookie parsing
- Static file serving
- Template engine support
- Better error handling
- Router mounting
- CORS support
- Compression
- Security headers

## License

MIT
