const mongoose = require('mongoose');

const pessoaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    cpf: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: { 
                rua:    { type: String, required: true },
                numero: { type: Number, required: true, minimum: 1 },
                bairro: { type: String, required: true },
                cidade: { type: String, required: true },
                estado: { type: String, enum: [ "DF","ES","MG","RJ","SC","MT","MS","RN","RS","AC","AL","AM","BA","CE","GO","MA","PA","PE","PI","RO","SE","TO","AP","PB","PR","RR" ,"SP"], required: true }
    }
});

module.exports = mongoose.model('Pessoa', pessoaSchema);