var app = require('./server-config.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortly', function(err) {
  !err ? console.log('Connected to monogo database') :
    console.log('Error connecting to mongo database:', err);
});

var port = 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
