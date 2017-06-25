var passport = require('passport');

// Método para autenticação Auth 2.0

module.exports = function(app) {

   app.get('/auth/github', passport.authenticate('github'));

   app.get('/auth/github/callback',
      passport.authenticate('github', {successRedirect: '/'})
   );

   app.get('/logout', function (req, res) {
      req.logOut();
      res.redirect('/');
   });

}