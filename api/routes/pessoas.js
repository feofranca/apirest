const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pessoa = require('../models/pessoa');

router.get("/", (req, res, next) => {
    Pessoa.find()
      .select("nome email senha cpf telefone endereco _id")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          pessoas: docs.map(doc => {
            return {
              nome: doc.nome,
              email: doc.email,
              cpf: doc.cpf,
              telefone: doc.telefone,
              endereco: doc.endereco,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/pessoas/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


  router.post("/", (req, res, next) => {
    const pessoa = new Pessoa({
      _id: new mongoose.Types.ObjectId(),
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      cpf: req.body.cpf,
      telefone: req.body.telefone,
      endereco: {
          rua: req.body.endereco.rua,
          numero: req.body.endereco.numero,
          bairro: req.body.endereco.bairro,
          cidade: req.body.endereco.cidade,
          estado: req.body.endereco.estado,
      }
    });
    pessoa
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Pessoa criada com sucesso",
          createdPessoa: {
            _id: result._id,
            nome: result.nome,
            email: result.email,
            cpf: result.cpf,
            telefone: result.telefone,
            endereco: result.endereco,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/pessoas/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  router.get("/:pessoaId", (req, res, next) => {
    const id = req.params.pessoaId;
    Pessoa.findById(id)
      .select('nome email senha cpf telefone endereco _id')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            message: "Dados Pessoais",
            dadosPessoa: {
              _id: doc._id,
              nome: doc.nome,
              email: doc.email,
              cpf: doc.cpf,
              telefone: doc.telefone,
              endereco: doc.endereco,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/pessoas'
              }
            }
          });
        } else {
          res
            .status(404)
            .json({ message: "ID inválido" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });
  
  router.patch("/:pessoaId", (req, res, next) => {
    const id = req.params.pessoaId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propriedade] = ops.value;
    }
    Pessoa.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Dados atualizados',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/pessoas/' + id
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  router.delete("/:pessoaId", (req, res, next) => {
    const id = req.params.pessoaId;
    const nome = req.params.nome;
    Pessoa.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Pessoa deletada',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/pessoas',
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  
  module.exports = router;