import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      {user ? (
        <p>Hola, {user.name} ({user.email})</p>
      ) : (
        <p>No has iniciado sesión.</p>
      )}
    </div>
  );
};

export default Dashboard;
