var mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/chat`, {useNewUrlParser: true, useUnifiedTopology: true});

console.log(__dirname);
