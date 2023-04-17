import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const startStory = () => {
    navigate("/heroes");
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={startStory}>Comenzar la historia</button>
    </div>
  );
};
