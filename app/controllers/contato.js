// A função de sanitização eliminará todas as chaves que começam com '$' na entrada,
// para que você possa passá-lo para o MongoDB sem se preocupar com a substituição de usuários mal-intencionados
//Solucionar os problemas de injeção query selector 
var sanitize = require('mongo-sanitize');


var contatos = [
   {
      _id: 1,
      nome: 'Contato Exemplo 1',
      email: 'cont1@empresa.com.br'
   },
   {
      _id: 2,
      nome: 'Contato Exemplo 2',
      email: 'cont2@empresa.com.br'
   },
   {
      _id: 3,
      nome: 'Contato Exemplo 3',
      email: 'cont3@empresa.com.br'
   }
];

module.exports = function() {
   var controller = {};
   
   controller.listaContatos = function(req, res) {
      res.json(contatos);
   };

   controller.obtemContato = function(req, res) {
      //console.log(req.params.id);

      var idContato = req.params.id;
      
      var filtrados = contatos.filter(function(contato) {
         return contato._id == idContato;
      });

      // O método filter sempre retorna um vetor,
      // mesmo que haja um só resultado. Por isso,
      // se houver encontrado alguém, pegamos a primeira
      // posição (0) do vetor
      if(filtrados.length > 0) { // Encontrou algo
         var contato = filtrados[0];
         res.json(contato);
      }
      else {
         res.status(404).send('Contato ' + idContato +
            ' não encontrado.');
      }
   }

   controller.removeContato = function(req, res) {
      
      //pegará o id e verificará se variavel é mal intencionada 
      var _id = sanitize(req.params.id);
      
      //var _id = req.params.id;

      //remove um contato do banco pelo seu ObjectId
      // Espera receber uma string 
      Contato.remove({"_id" : _id}).exec()
      
      //removeria-se todos os contatos no banco
      //Contato.remove({"_id" : "$ne" : null}).exec
      .then(
         function() {
            res.end();
         },
         function(erro){
            return console.error(erro)
         }
      );
      

   /*

      contatos = contatos.filter(function (contato) {
         return contato._id != req.params.id;
      });
      // HTTP 204: OK, mas não há conteúdo na resposta
      res.status(204).end();
  */
   };

   var ID_CONTATO_INC = 3; // Já existem três contatos

   controller.salvaContato = function(req, res) {
      
     // Ele pega tudo que esta no body atribuindo e jogando na variavel privada
      var _id = req.body._id;

      // Será limitado o objecto pegando as informações necessárias
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
