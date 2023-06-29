import { Button, Card, Space } from 'antd';


const PokeCard = ({ level, name, hp, attack, defense, type, InHomePage }) => {

  const releasePokemon = async () => {
    const response = await fetch("http://localhost:5000/pokemon/releasePokemon",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name
        })
      });

    
    const data = await response.json();
    window.location.reload();
    console.log(data)
    
    if (!response.ok) {
      throw new Error(data.message)
    }
  }


  return (
    <Card
      title={`Name: ${name}`}
      extra={`Level: ${level}`}
      style={{
        width: 300,
      }}
    >
      <p>HP: {hp}</p>
      <p>Attack: {attack}</p>
      <p>Defense: {defense}</p>
      <p>Type: {type}</p>
      {InHomePage && <Button type="primary" danger onClick={releasePokemon}>
        Release Pokémon
      </Button>}
    </Card>
  )
};
export default PokeCard;