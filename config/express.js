var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
// Plugins para tornar aplicação mais segura
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
      // Frase de segurança
      secret: 'As armas e os brasões assinalados',
      resave: true,
      saveUninitialized: true
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   

   // Inicializando o helmet
   app.use(helmet());
   //Previne ataque do tipo clickjacking.
   //Isso evita que a aplicação seja instanciada por códigos maliciosos usando iframes...
   app.use(frameguard());

   //Adiciona ao header o x-xss-protection, para evitar ataques xss refletido.   
   app.use(helmet.xssFilter());

   //Previne carregamento de arquivos indesejados
   app.use(helmet.noSniff());
   app.disable('x-powered-by');


// Redirecionamento para rotas Auth2
load('models', {cwd: 'app'}).then('controllers')
    .then('routes/auth.js')
    .then('routes')
    .into(app);


// retorna 404 caso a rota não seja encontrada
  app.get('*', function(req, res) {
     res.status(404).render('404');
  })


   return app;
};
