/**
 * Parse JSON request body
 */
async function parseJSON(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsed = JSON.parse(body || '{}');
                resolve(parsed);
            } catch (err) {
                reject(new Error('Invalid JSON'));
            }
        });
    });
}

/**
 * Parse URL-encoded request body (form data)
 */
async function parseURLEncoded(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsed = new URLSearchParams(body);
                const result = {};

                for (const [key, value] of parsed.entries()) {
                    result[key] = value;
                }

                resolve(result);
            } catch (err) {
                reject(new Error('Invalid URL-encoded data'));
            }
        });
    });
}

/**
 * Main body parser middleware factory
 */
function bodyParser(options = {}) {
    const { limit = '1mb', extended = true } = options;

    return async (req, res, next) => {
        // Skip if no body or already parsed
        if (req.body || req.method === 'GET' || req.method === 'HEAD') {
            return next();
        }

        const contentType = req.get('content-type') || '';

        try {
            if (contentType.includes('application/json')) {
                req.body = await parseJSON(req);
            } else if (
                contentType.includes('application/x-www-form-urlencoded')
            ) {
                req.body = await parseURLEncoded(req);
            } else {
                req.body = {};
            }

            next();
        } catch (err) {
            err.status = 400;
            next(err);
        }
    };
}

module.exports = {
    json: () => bodyParser({ type: 'json' }),
    urlencoded: (options) => bodyParser({ ...options, type: 'urlencoded' }),
    bodyParser,
};
