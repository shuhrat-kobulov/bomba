const createApp = require('../src/index');

const app = createApp();

// Global middleware - runs for all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route with no parameters
app.get('/', (req, res) => {
  res.send('<h1>Welcome to My Framework!</h1>');
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  res.json({
    message: 'User details',
    userId: req.params.id
  });
});

// POST route
app.post('/users', (req, res) => {
  res.status(201).json({
    message: 'User created',
    data: { id: 123 }
  });
});

// Query parameters example
app.get('/search', (req, res) => {
  res.json({
    query: req.query.q,
    page: req.query.page || 1
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
  console.log(`  GET  http://localhost:${PORT}/protected (with Authorization: secret-token)`);
  console.log(`  POST http://localhost:${PORT}/users`);
});
