const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const pokemonSchema = new Schema({
    userId: {
      type: String,
      required: true
    },

    level: {
      type: Number,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    hp: {
      type: Number,
      required: true
    },

    attack: {
      type: Number,
      required: true
    },

    defense: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      required: true
    }
});

pokemonSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Pokemon', pokemonSchema);

