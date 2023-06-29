import { Button, Modal } from 'antd';
import { useState } from 'react';


const LoseModal = ({ isModalOpen, handleClose }) => {



  const refreshPage = () => {
    window.location.reload();
    handleClose()
  } 

  return (
    <>
      <Modal title="That was so close!" open={isModalOpen} onOk={() => refreshPage()} okText="Find a New Pokémon!">
        <p>Oh No! The Pokémon has escaped! 😢</p>
      </Modal>
    </>
      
  );
};
export default LoseModal;