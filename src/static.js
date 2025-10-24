const fs = require('fs').promises;
const path = require('path');

// MIME type mapping
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
};

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Check if file exists and is readable
 */
async function fileExists(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch {
        return false;
    }
}

/**
 * Static file serving middleware factory
 */
function serveStatic(root, options = {}) {
    const {
        index = 'index.html',
        dotfiles = 'ignore', // 'ignore', 'allow', 'deny'
        maxAge = 0,
        setHeaders = null,
    } = options;

    return async (req, res, next) => {
        // Only handle GET and HEAD requests
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }

        // Get the requested path
        let requestPath = req.pathname;

        // Security: prevent directory traversal
        if (requestPath.includes('..')) {
            return res.status(403).send('Forbidden');
        }

        // Remove leading slash and join with root
        requestPath = requestPath.replace(/^\/+/, '');
        let filePath = path.join(root, requestPath);

        // Handle directory requests
        if (requestPath === '' || requestPath.endsWith('/')) {
            filePath = path.join(filePath, index);
        }

        // Check if it's a dotfile and handle according to options
        const basename = path.basename(filePath);
        if (basename.startsWith('.')) {
            if (dotfiles === 'deny') {
                return res.status(403).send('Forbidden');
            } else if (dotfiles === 'ignore') {
                return next();
            }
        }

        try {
            // Check if file exists
            if (!(await fileExists(filePath))) {
                return next();
            }

            // Read file
            const fileContent = await fs.readFile(filePath);
            const mimeType = getMimeType(filePath);
            const stats = await fs.stat(filePath);

            // Set headers
            res.set('Content-Type', mimeType);
            res.set('Content-Length', fileContent.length);
            res.set('Last-Modified', stats.mtime.toUTCString());

            // Set cache control
            if (maxAge > 0) {
                res.set('Cache-Control', `public, max-age=${maxAge}`);
            }

            // Custom headers callback
            if (setHeaders) {
                setHeaders(res, filePath, stats);
            }

            // Send file
            if (req.method === 'HEAD') {
                res.end();
            } else {
                res.end(fileContent);
            }
        } catch (err) {
            next(err);
        }
    };
}

module.exports = serveStatic;
