const Pokemon = require('../models/pokemon');
const HttpError = require('../models/http-error');
const CSVconverter = require('../data/convertCSVToJSON');

const allPokemonData = []

CSVconverter.convertCSVToJSON('pokemon.csv')
.then((pokemonData) => {
  for (let i = 0; i < pokemonData.length; i++) {
    allPokemonData.push(pokemonData[i])
  }
})
.catch((error) => {
  console.error('Error converting CSV to JSON:', error);
});


const getAllPokemon = async (req, res, next) => {
  res.json(allPokemonData)
};

const myPokemon = async (req, res, next) => {
  const userId = req.params.id
  
  try {
    Pokemon.find({ userId: userId })
      .then((pokemon) => {
        res.json(pokemon);
      })
  } catch (err) {
      const error = new HttpError(
        'Unable to add pokemon, please try again.',
        409
      );
      return next(error);
    }
  };


const unownedpokemon = async (req, res, next) => {
  const userId = req.params.id
  const unownedpokemonlist = [...allPokemonData]
  try {
    
    Pokemon.find({ userId: userId })
      .then((pokemon) => {
        const filteredpokemonlist = unownedpokemonlist.filter((p) => {
          return !pokemon.some((owned) => owned.name === p.name);
        })
        console.log(filteredpokemonlist)
        res.json(filteredpokemonlist)
      })
  } catch (err) {
    const error = new HttpError(
      'Unable to display pokemon list that are not owned by you',
      409
    );
    return next(error);
  }
};




const addPokemon = async (req, res, next) => {
  const userId = req.params.id

  try {
    const {name, hp, attack, defense, type, level} = req.body;
    const newPokemon = new Pokemon({
      userId,
      level,
      name,
      hp,
      attack,
      defense,
      type
    })
    await newPokemon.save()

    const pokemon = await Pokemon.find();
    res.status(201).json(pokemon)
  } catch (err) {
    const error = new HttpError(
      'Unable to add pokemon, please try again.',
      409
    );
    return next(error);
  }
};

const releasePokemon = async (req, res, next) => {

  try {
    const { name } = req.body;
    const data = await Pokemon.findOneAndDelete({ name: name })
    res.status(201).json(data)
  } catch (err) {
    const error = new HttpError(
      'No such pokemon, no release is being made.',
      500
    );
    return next(error);
  }
};


exports.unownedpokemon = unownedpokemon;
exports.myPokemon = myPokemon;
exports.releasePokemon = releasePokemon;
exports.addPokemon = addPokemon;
exports.getAllPokemon = getAllPokemon;