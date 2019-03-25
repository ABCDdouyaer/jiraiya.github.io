class Application extends Emitter {
    constructor() {
      super();
      this.middleware = [];
    }
  
    use(fn) {
      this.middleware.push(fn);
      return this;
    }
  
    callback() {
      const fn = compose(this.middleware);
      
      function (context, next) {
        // 记录上一次执行中间件的位置 #
        let index = -1
        return dispatch(0)
        function dispatch (i) {
          // 理论上 i 会大于 index，因为每次执行一次都会把 i递增，
          // 如果相等或者小于，则说明next()执行了多次
          if (i <= index) return Promise.reject(new Error('next() called multiple times'))
          index = i
          // 取到当前的中间件
          let fn = middleware[i]
          if (i === middleware.length) fn = next
          if (!fn) return Promise.resolve()
          try {
            return Promise.resolve(fn(context, function next () {
              return dispatch(i + 1)
            }))
          } catch (err) {
            return Promise.reject(err)
          }
        }
      }
  
      return function(req, res) {
        return fn(ctx);
      };
    }
  
    listen(...args) {
      const server = http.createServer(this.callback());
      return server.listen(...args);
    }
  }


  function compose (middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
      if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
  
    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */
  
    return function (context, next) {
      // 记录上一次执行中间件的位置 #
      let index = -1
      return dispatch(0)
      function dispatch (i) {
        // 理论上 i 会大于 index，因为每次执行一次都会把 i递增，
        // 如果相等或者小于，则说明next()执行了多次
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i
        // 取到当前的中间件
        let fn = middleware[i]
        if (i === middleware.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, function next () {
            return dispatch(i + 1)
          }))
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }
  

  