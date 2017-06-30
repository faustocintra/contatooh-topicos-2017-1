
/*Sanitaze elemina indices da chave que começa com a flag $. Isso é feito por questões de segurança
para evitar injeção query selector*/
var sanitize = require('mongo-sanitize');



var contatos = [
   {
      _id: 1,
      nome: 'Contato Exemplo 1',
      email: 'contact@company.com'
   },
   {
      _id: 2,
      nome: 'Contato Exemplo 2',
      email: 'contact2@company.com'
   },
   {
      _id: 3,
      nome: 'Contato Exemplo 3',
      email: 'contact3@company.com'
   }
];

module.exports = function() {
   var controller = {};
   
   controller.listaContatos = function(req, res) {
      res.json(contatos);
   };

   controller.obtemContato = function(req, res) {

      var idContato = req.params.id;
      
      var filtrados = contatos.filter(function(contato) {
         return contato._id == idContato;
      });
      
      if(filtrados.length > 0) {
         var contato = filtrados[0];
         res.json(contato);
      }
      else {
         res.status(404).send('Contato ' + idContato + ' não encontrado.');
      }
   }

   controller.removeContato = function(req, res) {
      
      // Ao pegar o ID checa se a variável é mal intencionada
      var _id = sanitize(req.params.id);
      
      Contato.remove({"_id" : _id}).exec()
      .then(
         function() {
            res.end();
         },
         function(erro){
            return console.error(erro)
         }
      );   
   };

   var ID_CONTATO_INC = 3;

   controller.salvaContato = function(req, res) {
           
     // Busca todas as chaves que estão no body
      var _id = req.body._id;

      // Obtém informações necessárias
      var dados = {
         "nome" : req.body.nome ,
         "email" : req.body.email,
         "emergencia" : req.body.emergencia || null
      };

      if(_id) {
      Contato.findByIdAndUpdate(_id, dados).exec()
         .then(
            function(contato) {
            res.json(contato);
            },
            function(erro) {
            console.error(erro)
            res.status(500).json(erro);
            }
         );
      } else {
      Contato.create(dados)
         .then(
            function(contato) {
            res.status(201).json(contato);
            },
            function(erro) {
            console.log(erro);
            res.status(500).json(erro);
            }
         );
      }

   }

   function adiciona(novo) {
      novo._id = ++ID_CONTATO_INC;
      contatos.push(novo);
      return novo;
   }

   function atualiza(existente) {

      contatos = contatos.map(function(contato){
         if(contato._id == existente._id) {
            contato = existente;
         }
         return contato;
      });
      
      return existente;
      
   }

   return controller;
};