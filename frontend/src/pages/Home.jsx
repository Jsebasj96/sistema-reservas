import React from 'react';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="App">
      <h1>Bienvenido al Club Campestre "La Buena Vida"</h1>

      {/* Botón con Chakra UI */}
      <Button onClick={onOpen} colorScheme="teal" size="lg" width="80%" borderRadius="30px">
        Ver Más Información
      </Button>

      {/* Modal de Chakra UI */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Información del Club</ModalHeader>
          <ModalBody>
            <p>El Club Campestre "La Buena Vida" ofrece un ambiente relajante con múltiples servicios y actividades para disfrutar con la familia y amigos.</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose} borderRadius="30px">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Home;

