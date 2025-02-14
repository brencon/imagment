const loadModule = () => import('./index.js');

module.exports = new Proxy({}, {
  get: (_, prop) => {
    return async () => {
      const mod = await loadModule();
      return mod[prop];
    };
  }
});
