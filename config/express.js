var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');
var helmet = require('helmet'); //habilita todos middlewares do Helmet

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

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
   app.use(helmet.frameguard()); //mitiga o ataque clickjacking -> substitui o xframe
   app.use(helmet.nosniff()); //não permite que o navegador carregue link e script que não sejam dos MIME
   app.disable('x-powered-by'); //desabilita a middleware  x-powered-by do helmet 
   app.use(helmet.xssFilter); //previne contra Tags maliciosas adicionadas por um <script> que direciona para um script malicioso
   app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.5.14'})); //fornece informaçao falsa atraves do middleware helmet.poweredBy
   app.use(helmet()); //usa o helmet no express

   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes')
      .into(app);

      app.get('*', function (req, res){ //criacao da rota com identificador * abaixo das demais rotas
          res.status(404).render('404');
      });

   return app;
};