var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');

module.exports = function() {

   var Usuario = mongoose.model('Usuario');

   passport.use(new GitHubStrategy({
      clientID: '8d3a28b0d2d0251d2576',
      clientSecret: '6ff3d6b7fa397c943cfa0c568cc2d7dd1c7d69bb',
      callbackURL: 'http://localhost:3000/auth/github/callback'
   }, function(accessToken, refreshToken, profile, done) {

      Usuario.findOrCreate(
         {login: profile.username},
         {nome: profile.username},
         function(erro, usuario) {
            if(erro) {
               console.log(erro);
               return done(erro); // Prossegue COM ERRO
            }
            return done(null, usuario); // Prossegue SEM ERRO
         }
      );

   }));

   passport.serializeUser(function(usuario, done) {
      done(null, usuario._id);
   });

   passport.deserializeUser(function(id, done) {
      Usuario.findById(id).exec().then(
         function(usuario) {
            done(null, usuario);
         }
      );
   });

};