const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Grupo = require('../models/grupo');
const Pessoa = require('../models/pessoa');

router.get("/", (req, res, next) => {
    Grupo.find()
      .select("pessoas _id")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          grupos: docs.map(doc => {
            return {
              pessoas : doc.pessoas,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/grupos/" + doc._id
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
    const grupo = new Grupo({
        _id: new mongoose.Types.ObjectId(),
        pessoas: req.body.pessoas
      });
      
    if(grupo.pessoas.length < 2) {
        return res.status(404).json({
            message: "Grupo deve conter mais de 2 pessoas"
          });
      }

    var validacao = grupo.pessoas.slice().sort(); 
    var results = [];
        for (var i = 0; i < validacao.length - 1; i++) {
        if (validacao[i + 1] == validacao[i]) {
        results.push(validacao[i]);
        }
      }

    if(results.length > 0) {
        return res.status(404).json({
            message: "Pessoa duplicada no grupo"
          });
    }
    for (var j = 0; j < grupo.pessoas.length; j++) {
        Pessoa.findById(grupo.pessoas[j])
        .then(pessoa => {
          if (!pessoa) {
            return res.status(404).json({
              message: "Alguma pessoa inserida não é cadastrada"
            });}
        }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
        }
 
    grupo
      .save()
      .then(result => {
        console.log(result);
        
        res.status(201).json({
          message: "Grupo criado com sucesso",
          createdGrupo: {
            _id: result._id,
           pessoas: result.pessoas,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/grupos/" + result._id
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
  
  router.get("/:grupoId", (req, res, next) => {
    const id = req.params.grupoId;
    Grupo.findById(id)
      .select('pessoas _id')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            message: "Dados do Grupo",
            dadosGrupo: {
              _id: doc._id,
              pessoas: doc.pessoas,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/grupos'
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
  
  router.patch("/:grupoId", (req, res, next) => {
    const id = req.params.grupoId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propriedade] = ops.value;
      }

    var validacao = updateOps["pessoas"].slice().sort(); 
    var results = [];
        for (var i = 0; i < validacao.length - 1; i++) {
        if (validacao[i + 1] == validacao[i]) {
        results.push(validacao[i]);
        }
      }

    if(results.length > 0) {
        return res.status(404).json({
            message: "Pessoa duplicada no grupo"
          });
    }
    for (var j = 0; j < updateOps["pessoas"].length; j++) {
        Pessoa.findById(updateOps["pessoas"][j])
        .then(pessoa => {
          if (!pessoa) {
            return res.status(404).json({
              message: "Alguma pessoa inserida não é cadastrada"
            });}
        }).catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
        }

      if(updateOps["pessoas"].length >=2)
      {
        Grupo.update({ _id: id }, { $set: updateOps})
        .exec()
        .then(result => {
          res.status(200).json({
              message: 'Dados atualizados',
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/grupos/' + id
              }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
      else
      {
        Grupo.remove({ _id: id })
        .exec()
        .then(result => {
          res.status(200).json({
              message: 'Grupo deletado',
              request: {
                  type: 'POST',
                  url: 'http://localhost:3000/grupo'
              }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
      }
  });
  
  router.delete("/:grupoId", (req, res, next) => {
    const id = req.params.grupoId;
    
    Grupo.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Grupo deletado',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/grupo'
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