# Bomba Framework ⚡

> A lightweight, Express-like web framework for Node.js built from scratch **for learning purposes**

Bomba is a minimalist web framework created specifically to help developers understand how web frameworks work under the hood. Inspired by Express.js, it provides the essential building blocks for creating web applications and APIs while being simple enough to read, understand, and extend.

## 🎓 Educational Purpose

This framework was built as a **learning project** to demonstrate:

-   How HTTP servers work in Node.js
-   Middleware pattern implementation
-   URL routing and pattern matching
-   Request/Response enhancement
-   Asynchronous request handling
-   Error handling in web applications

**Perfect for:** Students, bootcamp participants, and developers who want to understand how Express.js and similar frameworks work internally.

## 🚀 Why Bomba?

-   **📚 Educational**: Built specifically for learning and understanding web frameworks
-   **🔧 Simple**: Clean, readable code that's easy to follow and extend
-   **🪶 Lightweight**: Minimal dependencies, focusing on core concepts
-   **🎯 Familiar**: Express-like API for easy learning transition
-   **🧠 Insightful**: Heavily commented code explaining the "why" behind each decision

## Features

-   ✅ HTTP method routing (GET, POST, PUT, DELETE, PATCH)
-   ✅ Middleware support
-   ✅ Route parameters (`:id`, `:name`)
-   ✅ Query string parsing
-   ✅ Enhanced request/response objects
-   ✅ Error handling
-   ✅ Chainable API

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

-   `req.params` - Route parameters
-   `req.query` - Query string parameters
-   `req.get(headerName)` - Get header value
-   `req.accepts(type)` - Check accepted content type

### Response Object

-   `res.status(code)` - Set status code
-   `res.json(data)` - Send JSON response
-   `res.send(data)` - Send response
-   `res.set(field, value)` - Set header
-   `res.redirect([status], url)` - Redirect to URL

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

-   Cookie parsing
-   Template engine support
-   Better error handling
-   Router mounting
-   CORS support
-   Compression
-   Security headers

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📋 Roadmap

-   [✅] Body parsing (JSON, URL-encoded, multipart)
-   [ ] Cookie parsing and session management
-   [✅] Static file serving
-   [ ] Template engine support
-   [ ] Router mounting and sub-applications
-   [ ] CORS middleware
-   [ ] Security headers
-   [ ] Compression middleware
-   [ ] Rate limiting
-   [ ] WebSocket support

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/shuhrat-kobulov/bomba/issues).

## ⭐ Show Your Support

If you like this project, please consider giving it a star on GitHub!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shuhrat Kobulov**

-   GitHub: [@shuhrat-kobulov](https://github.com/shuhrat-kobulov)

---

<div align="center">
  <strong>Built with ❤️ for learning and the Node.js community</strong>
  <br>
  <em>⭐ If this helped you understand web frameworks better, please star the repo!</em>
</div>
