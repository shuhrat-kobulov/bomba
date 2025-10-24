const createApp = require('../src/index');

const app = createApp();

// Global middleware - runs for all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Enable body parsing
app.enableBodyParsing();

// Serve static files from examples/public directory
app.static('./examples/public');

// API endpoint for the demo page
app.get('/test', (req, res) => {
    res.json({
        message: 'Hello from Bomba API!',
        timestamp: new Date().toISOString(),
        framework: 'Bomba v0.1.0',
    });
});

// Route with parameters
app.get('/users/:id', (req, res) => {
    res.json({
        message: 'User details',
        userId: req.params.id,
    });
});

// POST route
app.post('/users', (req, res) => {
    console.log('Received JSON body:', req.body);
    res.json({
        message: 'User created successfully',
        receivedData: req.body,
        contentType: req.get('content-type'),
    });
});

// Query parameters example
app.get('/search', (req, res) => {
    res.json({
        query: req.query.q,
        page: req.query.page || 1,
    });
});

// Multiple handlers (middleware chain)
const authenticate = (req, res, next) => {
    const token = req.get('Authorization');
    if (token === 'secret-token') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'This is protected content' });
});

// Error handling example
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nTry these endpoints:');
    console.log(`  GET  http://localhost:${PORT}/`);
    console.log(`  GET  http://localhost:${PORT}/users/42`);
    console.log(`  GET  http://localhost:${PORT}/search?q=test&page=2`);
    console.log(
        `  GET  http://localhost:${PORT}/protected (with Authorization: secret-token)`
    );
    console.log(`  POST http://localhost:${PORT}/users`);
});
