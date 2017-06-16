var express = require('express');
//var home = require('../app/routes/home');
var load = require('express-load');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

// Adicionando o helmet
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

   // Disfarçando a X-Powered-By (tecnologia utilizada)
   app.use(helmet.hidePoweredBy({setTo: '.NET CORE'}));

   // Proibindo o acesso através de um frame ou iframe
   app.use(helmet.frameguard());

   //Filtro XSS para evitar inserção de scripts
   app.use(helmet.xssFilter());

   // Proibindo que o browser forneça conteúdo das tags link e script fora dos mime types text/css e text/javascript
   app.use(helmet.noSniff());



   //home(app);
   load('models', {cwd: 'app'})
      .then('controllers')
      .then('routes/auth.js')
      .then('routes')
      .into(app);
    
    app.get('*', function(req, res) {
        res.status(404).render('404');
    });

   return app;
};