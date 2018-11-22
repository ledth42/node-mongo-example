const mongoose = require('mongoose');
const config = require('./../config/config')[process.env.NODE_ENV || 'development'];
const url = config.mongodb_url;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(url,{useNewUrlParser: true});

module.exports = {mongoose};
