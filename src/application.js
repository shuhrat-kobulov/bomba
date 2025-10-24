const http = require('http');
const Router = require('./router');
const { enhanceRequest, enhanceResponse } = require('./enhancers');

class Application {
    constructor() {
        this.router = new Router();
        this.middleware = [];
        this.settings = {};
    }

    /**
     * Register a middleware function
     */
    use(path, ...handlers) {
        // If path is a function, it's actually a middleware
        if (typeof path === 'function') {
            handlers = [path, ...handlers];
            path = '/';
        }

        handlers.forEach((handler) => {
            this.middleware.push({ path, handler });
        });

        return this;
    }

    /**
     * HTTP method shortcuts
     */
    get(path, ...handlers) {
        this.router.addRoute('GET', path, handlers);
        return this;
    }

    post(path, ...handlers) {
        this.router.addRoute('POST', path, handlers);
        return this;
    }

    put(path, ...handlers) {
        this.router.addRoute('PUT', path, handlers);
        return this;
    }

    delete(path, ...handlers) {
        this.router.addRoute('DELETE', path, handlers);
        return this;
    }

    patch(path, ...handlers) {
        this.router.addRoute('PATCH', path, handlers);
        return this;
    }

    /**
     * Set application settings
     */
    set(key, value) {
        this.settings[key] = value;
        return this;
    }

    /**
     * Get application settings
     */
    getSetting(key) {
        return this.settings[key];
    }

    /**
     * Enable body parsing middleware
     */
    enableBodyParsing() {
        const { bodyParser } = require('./body-parser');
        this.use(bodyParser());
        return this;
    }

    /**
     * Serve static files from a directory
     */
    static(path, options = {}) {
        const serveStatic = require('./static');
        this.use(serveStatic(path, options));
        return this;
    }

    /**
     * Handle incoming requests
     */
    async handleRequest(req, res) {
        // Enhance request and response objects
        enhanceRequest(req);
        enhanceResponse(res);

        let index = 0;

        // Create next() function for middleware chain
        const next = async (err) => {
            if (err) {
                return this.handleError(err, req, res);
            }

            // First, execute global middleware
            if (index < this.middleware.length) {
                const { path, handler } = this.middleware[index++];

                // Check if middleware path matches
                if (req.url.startsWith(path)) {
                    try {
                        await handler(req, res, next);
                    } catch (error) {
                        this.handleError(error, req, res);
                    }
                } else {
                    next();
                }
            } else {
                // Then, try to match a route
                const route = this.router.match(req.method, req.url);

                if (route) {
                    req.params = route.params;

                    // Execute route handlers
                    let handlerIndex = 0;
                    const routeNext = async (err) => {
                        if (err) {
                            return this.handleError(err, req, res);
                        }

                        if (handlerIndex < route.handlers.length) {
                            try {
                                await route.handlers[handlerIndex++](
                                    req,
                                    res,
                                    routeNext
                                );
                            } catch (error) {
                                this.handleError(error, req, res);
                            }
                        }
                    };

                    await routeNext();
                } else {
                    // No route found - 404
                    res.status(404).send('Not Found');
                }
            }
        };

        await next();
    }

    /**
     * Error handler
     */
    handleError(err, req, res) {
        console.error('Error:', err);

        if (!res.headersSent) {
            res.status(err.status || 500).json({
                error: {
                    message: err.message || 'Internal Server Error',
                    status: err.status || 500,
                },
            });
        }
    }

    /**
     * Start listening on a port
     */
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(port, () => {
            if (callback) callback();
        });

        return server;
    }
}

module.exports = Application;
