import PokeCard from "../components/Card";
import { useState, useEffect } from "react";
import { InputNumber, Button } from 'antd';
import LoseModal from "../components/LoseModal";

const GamePage = () => {

  const [unownedPokemon, setUnownedPokemon] = useState([])
  const [chosenNumber, setChosenNumber] = useState(0)
  const [lives, setLives] = useState(3)
  const [LoseModalOpen, setLoseModalOpen] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [isLower, setIsLower] = useState(false)
  const [isHigher, setIsHigher] = useState(false)
  const [isCaptured, setIsCaptured] = useState(false)
  
  const id = localStorage.getItem("UserId") 
  console.log(id)

  const getUnownedPokemon = async () => {

    console.log(id)
    const response = await fetch(`http://localhost:5000/pokemon/unownedpokemon/${id}`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });

    
    const data = await response.json();
    console.log(data)
    
    const OneUnownedPokemonindex = Math.floor(Math.random() * data.length)
    const OneUnownedPokemon = data[OneUnownedPokemonindex]
    
    // adding pokemon level to hash table of pokemon
    const randompokemonlevel = Math.floor(Math.random() * 101)
    OneUnownedPokemon["level"] = randompokemonlevel

    console.log(OneUnownedPokemon)
    setUnownedPokemon([OneUnownedPokemon])
  }

  useEffect(() => {
    getUnownedPokemon();
  }, [])


  const RandomNumberGenerator = () => {
    const randominteger = Math.floor(Math.random() * 100) + 1
    
    console.log(randominteger)
    setRandomNumber(randominteger);
  }

  useEffect(() => {
    RandomNumberGenerator();
  }, [])


  const ChosenNumberHandler = (value) => {
    setChosenNumber(value)
    console.log(value)
  };


  const CapturePokemon = async ( unownedPokemon ) => {

    console.log(unownedPokemon)
    console.log(id)
    try {
      const response = await fetch(`http://localhost:5000/pokemon/addpokemon/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attack: unownedPokemon.attack,
          defense: unownedPokemon.defense,
          hp: unownedPokemon.hp,
          level: unownedPokemon.level,
          name: unownedPokemon.name,
          type: unownedPokemon.type,
        })
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message)
      }

      console.log(responseData);
      setTimeout(() => window.location.reload(), 3000)
    } catch (err) {
      console.log(err);
    }
  }


  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (lives === 1 && (chosenNumber !== randomNumber)) {
      setLives((prevState) => prevState - 1)
      setIsLower(false)
      setIsHigher(false)
      setLoseModalOpen(true)
    } else {

      if (chosenNumber === randomNumber) {
        CapturePokemon(unownedPokemon[0])
        setIsCaptured(true)
        console.log("Pokemon Captured!")
      } else {

        if (chosenNumber > randomNumber) {
          setIsHigher(true)
          setIsLower(false)
        } else {
          setIsLower(true)
          setIsHigher(false)
        }

        setLives((prevState) => prevState - 1)
      }
    }

  }

  
  return (
    <>
      <h1>Catch the Pokémon in front of you!</h1>
      <div className='row-wrapper'>
        
        <h4>To catch a Pokémon</h4>
        <p>Guess a Number between 1- 100</p>
        <h5>Lives: {lives}</h5>
        {unownedPokemon.map((pokemon) => 
            <PokeCard 
              key={pokemon._id} 
              level={pokemon.level} 
              name={pokemon.name} 
              hp={pokemon.hp} 
              attack={pokemon.attack} 
              defense={pokemon.defense} 
              type={pokemon.type}
              InHomePage = {false} 
            />
        )}
        
      </div>
      <div>
        <InputNumber min={1} max={100} defaultValue={1} onChange={ChosenNumberHandler} />
      </div>
      <Button type="primary" danger onClick={SubmitHandler}>
        Throw a Pokéball!
      </Button>
      <LoseModal isModalOpen={LoseModalOpen} handleClose={() => setLoseModalOpen(false)}/>
      {isLower && <p>Your guess is too low! Try a higher number!</p>}
      {isHigher && <p>Your guess is too higher! Try a lower number!</p>}
      {isCaptured && <p>Congratulations! {unownedPokemon[0].name} has been caught!</p>}
    </>
  )
}

export default GamePage;
