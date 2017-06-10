var sanitize = require('mongo-sanitize');//solucionar problema de injeção através de query selectors

module.exports = function(app) {
   var controller = {};
   
   var Contato = app.models.contato;

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
		var _id = sanitize(req.params.id);//chaves que contenham query selectors serão removidas do objeto
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
		var _id = req.body._id;
		//seleciona apenas nome, email e emergencia, independente da quantidade de parâmetros
		var dados = {
			"nome" : req.body.nome,
			"email" : req.body.email,
			"emergencia" : req.body.emergencia || null
		}
		if(_id) { // Atualização
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