import React from "react";
import "./HomePage.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const startStory = () => {
    navigate("/heroes");
  };

  const viewHeroes = () => {
    navigate("/myheroes")
  };

  return (
    <div>
      <h1>Home</h1>

      <div className="books-container">
  <div className="book-container">
    <div className="book" onClick={startStory}>
      <img src="../../../public/images/battle_cover.png" />
    </div>
  </div>
  <div className="book-container">
    <div className="book" onClick={viewHeroes}>
      <img src="../../../public/images/heroes_cover.png" />
    </div>
  </div>
</div>

    </div>
  );
};
