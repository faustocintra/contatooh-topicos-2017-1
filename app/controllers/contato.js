module.exports = function(app) {
   var controller = {};

   var sanitize = require('mongo-sanitize');
   
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
		var _id = sanitize(req.params.id);
		/* 
			Ao fazer o delete usando o sanitize evitamos os ataques de 
			query selectors
		*/
		Contato.remove({"_id" : _id}).exec()
		.then(
			function(){
				res.status(204).end();
			},
			function(erro){
				return console.error(erro);
			}
		);
   };

   controller.salvaContato = function(req, res) {
		var _id = req.body._id;
		/*
			Seleciona apenas o nome, email e emergencia do
			post do formulário
		*/
		var dados = {
			"nome" : req.body.nome,
			"email" : req.body.email,
			"emergencia" : req.body.emergencia || null
		};

		if(_id){
			Contato.findByIdAndUpdate(_id, dados).exec()
			.then(
				function(contato){
					res.json(contato);
				},
				function(erro){
					console.error(erro)
					res.status(500).json(erro);
				}
			);
		} else{
			Contato.create(req.body)
			.then(
				function(contato){
					res.status(201).json(contato);
				},
				function(erro){
					console.log(erro);
					res.status(500).json(erro);
				}
			);
		}
   };

   return controller;
};