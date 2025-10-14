const url = require('url');

/**
 * Enhance the request object with utility methods
 */
function enhanceRequest(req) {
  // Parse URL and query parameters
  const parsedUrl = url.parse(req.url, true);
  req.query = parsedUrl.query;
  req.pathname = parsedUrl.pathname;
  req.params = {};

  /**
   * Get a header value
   */
  req.get = function(headerName) {
    return this.headers[headerName.toLowerCase()];
  };

  /**
   * Check if request accepts a content type
   */
  req.accepts = function(type) {
    const acceptHeader = this.get('accept') || '';
    return acceptHeader.includes(type);
  };
}

/**
 * Enhance the response object with utility methods
 */
function enhanceResponse(res) {
  /**
   * Set status code
   */
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };

  /**
   * Send JSON response
   */
  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  };

  /**
   * Send text/html response
   */
  res.send = function(data) {
    if (typeof data === 'object') {
      return this.json(data);
    }
    
    if (typeof data === 'string') {
      this.setHeader('Content-Type', 'text/html');
    }
    
    this.end(data);
    return this;
  };

  /**
   * Set a header
   */
  res.set = function(field, value) {
    if (typeof field === 'object') {
      Object.keys(field).forEach(key => {
        this.setHeader(key, field[key]);
      });
    } else {
      this.setHeader(field, value);
    }
    return this;
  };

  /**
   * Redirect to a URL
   */
  res.redirect = function(statusOrUrl, url) {
    let status = 302;
    let location = statusOrUrl;

    if (typeof statusOrUrl === 'number') {
      status = statusOrUrl;
      location = url;
    }

    this.status(status);
    this.set('Location', location);
    this.end();
    return this;
  };
}

module.exports = {
  enhanceRequest,
  enhanceResponse
};
