

var sanitize = require('mongo-sanitize');

// resolver problema de injeção através de query selectors

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

module.exports = function (app) {

  var Contato = app.models.contato;

  var controller = {}

  controller.listaContatos = function(req, res) {
  
    Contato.find().populate('emergencia').exec()
    .then(
      function(contatos) {
         res.json(contatos); 
       },
       function(erro) {
         console.error(erro)
         res.status(500).json(erro);
       } 
    );    
  };
  
  controller.obtemContato = function(req, res) {

    var _id = req.params.id;
    Contato.findById(_id).exec()
    .then(
      function(contato) {
        if (!contato) throw new Error("Contato não encontrado");
        res.json(contato)     
      }, 
      function(erro) {
        console.log(erro);
        res.status(404).json(erro)
      }
    );    
  };

  controller.removeContato = function(req, res) { 
  
    var _id = sanitize(req.params.id);
    //remove chaves do projeto
    Contato.remove({"_id" : _id}).exec()
    .then(
      function() {
        res.end();  
      }, 
      function(erro) {
        return console.error(erro);
      }
    );
  };

  controller.salvaContato = function(req, res) {
  
    var _id = req.body._id; 
    //separa apenas nome, email e emergencia, apesar da quantidade de parâmetros
    var dados = { 
      "nome" : req.body.nome, 
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
  };

  return controller;
};