const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');

const routes = require('./routes');

const app = express();
app.set('port', process.env.PORT || 3721);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'img', 'byvoid.ico')));
app.use(bodyParser.urlencoded());
app.use(serveStatic(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/', routes.index);
app.post('/convert', routes.convert);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
