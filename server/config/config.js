module.exports = {
  development: {
    port: process.env.PORT || 3000,
    mongodb_url: process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  },
  test: {
    port: process.env.PORT || 3000,
    mongodb_url: process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAppTest',
  },
  production: {
    port: process.env.PORT || 3000,
    mongodb_url: process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  },
};
