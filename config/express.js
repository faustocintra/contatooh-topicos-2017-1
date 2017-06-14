var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

// Incluir modulo 'helmet'
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

    //Ativar middleware 'frameguard'
    // É através do middleware helmet.xframe que evitamos que nossas páginas sejam referenciadas por <frame> ou <iframe>.
   app.use(helmet.frameguard());

   //Esse código adiciona o header htpp X-XSS-Protection 
   // O header solicita ao navegador a ativação de uma proteção especial contra XSS.
   app.use(helmet.xssFilter());

    //Esse código adiciona o noSniff 
    //que impede o carregamento através das tags link e script arquivos que não sejam dos MIME types text/css e
    //text/javascript
   app.use(helmet.noSniff());

   //Ativar middleware que desabilita 'x-powered-by', para deixar de exibir 
   //qual tecnologias está sendo utilizada pelo servidor.
   app.disable('x-powered-by');

   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes/auth.js')
      .then('routes')
      .into(app);

   // se nenhum rota atender, direciona para página 404,
   // evitando o retorno padrão do express para o erro 404
 app.get('*', function(req, res) {
    res.status(404).render('404');
 });

 return app;
};