var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
// tornará sua aplização mais segura 
var helmet = require('helmet');
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
      // Frase secreta, escolha a sua
      secret: 'As armas e os brasões assinalados',
      resave: true,
      saveUninitialized: true
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   

   // Inicializando o helmet
   app.use(helmet());
   //Previne ataque do tipo clickjacking.
   //Evitando que a nossa aplicação seja referenciada por um iframe ou frame com códigos maliciosos.
   app.use(frameguard());

   //Adiciona ao header o x-xss-protection, para evitar ataques xss refletido.
   //Evita a inclusão de uma tag scritp que contenha um código malicioso na aplicação.
   app.use(helmet.xssFilter());

   //Faz com que o navegador não carregue arquivos diferentes da qual as tags link e script aceitam.
   //Ou seja serão aceitos somente os arquivos que as tags link(text/css) e script(text/javascript) aceitam.
   app.use(helmet.noSniff());

   //Fornecendo informação falsa sobre a tecnologia usad, para dificultar o reconhecimento da tecnologia usada na aplicação.
   //Assim evitando a exploração de vulnerabilidades da tecnologia usada.
   app.disable('x-powered-by');


// Esta sendo direcionada para rotas contindas no auth.js  
load('models', {cwd: 'app'})
    .then('controllers')
    .then('routes/auth.js')
    .then('routes')
    .into(app);


// Irá informar ao úsuario que se rota não for encontrada retornará para página 404
  app.get('*', function(req, res) {
     res.status(404).render('404');
  })


   return app;
};