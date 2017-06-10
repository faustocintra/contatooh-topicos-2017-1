var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var helmet = require('helmet'); // habilitando os middlewares


module.exports = function () {
   var app = express();
   app.set('port', 3000);
   app.use(express.static('./public'));
   app.set('view engine', 'ejs');
   app.set('views', './app/views');

   app.use(bodyParser.urlencoded({extended: true}));
   app.use(bodyParser.json());
   app.use(require('method-override')());

   app.use(cookieParser());
   app.use(session({
      // Frase secreta, escolha a sua
      secret: 'As armas e os brasões assinalados',
      resave: true,
      saveUninitialized: true
   }));
   app.use(passport.initialize());
   app.use(passport.session());

   app.use(helmet()); // Inicializando o helmet

   //Omitindo a informção no header http
   app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.5.14' })); 

    //Este método ná permite que a apicção seja colocada dentro de um frame ou iframe
   app.use(helmet.frameguard());

   //Este método confere proteção contra XSS
   app.use(helmet.xssFilter());

   //Este método  não permite que aquivos que são sejam
   //MIME type sejam carregados 
   app.use(helmet.nosniff());

   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes')
      .into(app);
   return app;
};