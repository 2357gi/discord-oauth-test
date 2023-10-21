// src/pages/index.tsx
import React from 'react';
import LoginButton from '../components/LoginButton';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <LoginButton />
    </div>
  );
};

export default HomePage;
