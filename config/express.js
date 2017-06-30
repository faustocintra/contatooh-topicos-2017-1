var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var helmet = require('helmet');//requerimento de pacote helmet

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

   //A execução app.use(helmet())não inclui todas essas funções de middleware por padrão.
   //Sendo um conjunto de 12 funcoes menores
   app.use(helmet());
   app.use(helmet.xframe());//cabeçalho de resposta HTTP
   app.use(helmet.xssFilter());//define o X-XSS-Protectioncabeçalho evitando ataques XSS refletidos
   app.use(helmet.nosniff());
   app.disable('x-powered-by');

   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes/auth.js')
      .then('routes')
      .into(app);

//tratando retorno de erro 404 
   app.get('*', function(req, res) {
      res.status(404).render('404');
   });
   return app;
};