const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(url,{useNewUrlParser: true});

module.exports = {mongoose};
