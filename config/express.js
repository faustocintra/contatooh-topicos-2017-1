var helmet = require('helmet'); //habilitar todos os seus middlewares de tratamento de header
var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');

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

   app.use(helmet());//habilitar middlewares de tratamento de header
   app.use(helmet.hidePoweredBy({ setTo: 'PHP 5.5.14' }));//fornece uma informação falsa da tecnologia que está sendo usada pelo servidor
   app.use(helmet.xframe());//Evita possíveis ataques do tipo clickjacking.
   //app.use(helmet.frameguard({ action: 'deny' }));//alternativa para xframe. Evita possíveis ataques do tipo clickjacking.
   app.use(helmet.xssFilter());//configura o X-XSS-Protection para ativar o filtro de Cross-site scripting (XSS) nos navegadores da web mais recentes.
   app.use(helmet.nosniff());//configura o X-Content-Type-Options para evitar que os navegadores procurem por MIME uma resposta a partir do content-type declarado.
   


   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes/auth.js')
      .then('routes')
      .into(app);

   //direciona para página 404 se nenhuma rota funcionar (se for fornecido um endereço não existente)
   app.get('*', function(req, res){
       res.status(404).render('404');
   })
   return app;
};