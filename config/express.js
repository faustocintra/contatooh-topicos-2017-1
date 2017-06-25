var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var helmet = require('helmet');
//permitir todos os seus middlewares de tratamento 
var frameguard = require('frameguard');


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
      secret: 'As armas e os brasões assinalados',
      resave: true,
      saveUninitialized: true
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   
   //permitir todos os seus middlewares e  header
   app.use(helmet());


   app.use(frameguard());

   //proporciona alternativa para xframe. Impedindo ataques do tipo clickjacking.
   app.use(helmet.xssFilter());

   //reformula o X-XSS-Protection para ativar o filtro de Cross-site scripting .
   app.use(helmet.noSniff());

   //reformula o X-Content-Type-Options  que evita busca no  MIME
   app.disable('x-powered-by');

//fornece uma informação falsa da tecnologia que está sendo usada pelo servidor
load('models', {cwd: 'app'})
    .then('controllers')
    .then('routes/auth.js')
    .then('routes')
    .into(app);

// carrega as rotas do auth.js
  app.get('*', function(req, res) {
     res.status(404).render('404');
  })


   return app;
};