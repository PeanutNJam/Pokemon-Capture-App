import { PoweroffOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { Menu, Button, Col, Row } from 'antd';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Store/auth-context';
import PokeCard from '../components/Card';
import "./HomePage.css";


const HomePage = () => {

 

  const [user, setUser] = useState(null);
  const [userpokemon, setUserPokemon] = useState([]);
  
  const id = localStorage.getItem("UserId") 
  const navigate = useNavigate()


  const authCtx = useContext(AuthContext);

  const LogOffHandler = () => {
    authCtx.logout()
    localStorage.removeItem("UserId")
    navigate("/")
  }

  const items = [
    {
      label: (
        <a href="http://localhost:3000/catch">
          Catch a Pokémon Here!
        </a>
      ),
      key: 'catch',
      icon: <Icon icon="mdi:pokeball" />,
    },
    {
      label: (
        <div class="menu-left-item">
          <Button
              type="primary"
              icon={<PoweroffOutlined />}
              danger
              onClick={LogOffHandler}
          >
            Log Out
          </Button>
        </div>
      ),
      key: 'alipay',
    },
  ];

  const getUser = async () => {
    
    const response = await fetch(`http://localhost:5000/api/users/${id}`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });
    const data = await response.json();
    console.log(data)
    console.log(data._id)
    setUser(data._id);
  };

  useEffect(() => {
    getUser();
  }, [])


  const getUserPokemonList = async () => {
    const response = await fetch(
      `http://localhost:5000/pokemon/mypokemon/${id}`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json()
    console.log(data)
    setUserPokemon(data);
  }

  useEffect(() => {
    getUserPokemonList();
  }, [])

  if (!user) {
    return null;
  }

  console.log(userpokemon)

  return (
    <>
      <Menu 
        theme="dark" mode="horizontal" items={items}  
      >

      </Menu>
      <h1>Your Collection of Pokémon</h1>
      <Row gutter={[16, 24]}>
        {userpokemon.map((pokemon) =>
          <Col span={4}>
            <PokeCard 
              key={pokemon._id} 
              level={pokemon.level} 
              name={pokemon.name} 
              hp={pokemon.hp} 
              attack={pokemon.attack} 
              defense={pokemon.defense} 
              type={pokemon.type}
              InHomePage = {true}
            />
          </Col> 
        )}
      </Row>
    </>
  )
};
export default HomePage;