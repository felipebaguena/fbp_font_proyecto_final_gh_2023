import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from '../Home/HomePage';
import { RegisterPage } from '../Register/RegisterPage';

export const Body = () => {
    return (
      <>
          <Routes>
          <Route path = '/' element = {<HomePage/>}/>
          <Route path = 'register' element = {<RegisterPage/>}/>
          </Routes>
    </>
  )
}