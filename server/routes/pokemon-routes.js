const express = require('express');

const pokemonController = require('../controllers/pokemon-controllers');

const router = express.Router();

router.get('/unownedpokemon/:id', pokemonController.unownedpokemon)

router.get('/mypokemon/:id', pokemonController.myPokemon)

router.get('/allpokemon', pokemonController.getAllPokemon)

router.post('/addpokemon/:id', pokemonController.addPokemon)

router.post('/releasepokemon', pokemonController.releasePokemon)

module.exports = router;