import React from 'react';
import Dashboard from './Dashboard';






const Main = ({ user }) => {
  return (
    <div>
      {/* Renderizar el Dashboard */}
      <Dashboard user={user} />


    </div>
  );
}; 

export default Main;
