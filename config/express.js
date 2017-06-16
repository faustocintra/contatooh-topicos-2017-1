var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');

// código anterior omitido
load('models', {cwd: 'app'})
    .then('controllers')
    .then('routes/auth.js')
    .then('routes')
    .into(app);

// se nenhum rota atender, direciona para página 404
app.get('*', function(req, res) {
    res.status(404).render('404');
});
  
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

// fazendo a requisição do helmet
var helmet = require('helmet');

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

   /*este comando desabilita as informações do servidor o qual a aplicação
     está hospedada, para evitar possíveis vulnerabilidades.*/
   app.disable('x-powered-by');

   /*comando responsável por impedir que a página seja incorporada em iframes */
   app.use(helmet({
      frameguard: {
        action: 'deny'
      }
   }));

   /*Este filtro previne ataques do tipo xss, e impede que sejam inseridos scripts maliciosos*/
   app.use(helmet.xssFilter());

   /*Este comando não permite que arquivos que não sejam do tipo text/css e text/javascript sejam
   incluídos na página */
   app.use(helmet.nosniff());


   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes')
      .into(app);
   return app;
};