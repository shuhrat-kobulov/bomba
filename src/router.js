class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * Add a route to the router
   */
  addRoute(method, path, handlers) {
    const route = {
      method,
      path,
      handlers,
      pattern: this.pathToRegex(path)
    };
    this.routes.push(route);
  }

  /**
   * Convert path pattern to regex
   * Supports :param syntax
   */
  pathToRegex(path) {
    const paramNames = [];
    
    // Extract parameter names
    const regexPattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '([^\\/]+)';
      });

    return {
      regex: new RegExp(`^${regexPattern}$`),
      paramNames
    };
  }

  /**
   * Match a request to a route
   */
  match(method, url) {
    // Remove query string from URL
    const pathname = url.split('?')[0];

    for (const route of this.routes) {
      if (route.method === method) {
        const match = pathname.match(route.pattern.regex);
        
        if (match) {
          const params = {};
          
          // Extract parameter values
          route.pattern.paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
          });

          return {
            handlers: route.handlers,
            params
          };
        }
      }
    }

    return null;
  }
}

module.exports = Router;
