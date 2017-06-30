module.exports = function(app) {
   var controller = {};
   
   var Contato = app.models.contato;

   //inclui o modulo 'mongo-sanitize'
   var sanitize = require('mongo-sanitize');

   controller.listaContatos = function(req, res) {
      Contato.find().populate('emergencia').exec().then(
			function(contatos) {
				res.json(contatos);
			},
			function(erro) {
				console.error(erro);
				// HTTP 500: erro interno do servidor
				res.status(500).json(erro);
			}
      );      
   };

   controller.obtemContato = function(req, res) {
      Contato.findById(req.params.id).exec().then(
			function(contato) {
				console.log(req.params.id);
				if(! contato) {
					throw new Error('Contato não encontrado');
				}
				res.json(contato);
			},
			function(erro) {
				console.log(erro);
				res.status(404).json(erro);
			}
      );
   };

   controller.removeContato = function(req, res) {
	   // Remove chaves que contenham query selectors
	    var _id = sanitize(req.params.id);
		Contato.remove({"_id" : _id}).exec().then(
			function() {
				// HTTP 204: OK, sem conteúdo a seguir
				res.status(204).end();
			},
			function(erro) {
				return console.error(erro);
			}
		);
   }

   controller.salvaContato = function(req, res) {
	    // Declara a variavel  _id e atribui a mesma o req.body._id
		var _id = req.body._id;

		/* Independente da quantidade de parâmetros, apenas selecionamos 
		o nome, email e emergencia para que não sejam inseridos dados fora do 
		contexto do cadastro de contato.
 		*/

		 var dados = {
			"nome" : req.body.nome,
			"email" : req.body.email,
			"emergencia" : req.body.emergencia || null
		};

		if(_id) {
			Contato.findByIdAndUpdate(_id, dados).exec()
				.then({
					function(contato) {
						res.json(contato);
					},
					function(erro) {
						console.error(erro);
						res.status(500).json(erro);
					}
				});
		}
		else { // Inserção
			Contato.create(dados).then(
				function(contato) {
					// HTTP 201: criado					
					res.status(201).json(contato);
				},
				function(erro) {
					console.log(erro);
					res.status(500).json(erro);
				}
			)
		}
   };

   return controller;
};