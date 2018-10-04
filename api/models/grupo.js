const mongoose = require('mongoose');

const grupoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pessoas: { type: Array, ref: 'Pessoa', required: true }
})

module.exports = mongoose.model('Grupo', grupoSchema);