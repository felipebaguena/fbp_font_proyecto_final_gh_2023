import React from 'react';
import "./MainApp.css";
import { NavbarTop } from '../components/NavBar/NavBar';

import { Body } from './Body/Body';
import { GameFooter } from '../components/GameFooter/GameFooter';

export const MainApp = () => {
  return (
    <div className="main-app-container">
      <NavbarTop/>
      <Body />
      <GameFooter/>
    </div>
  )
}
