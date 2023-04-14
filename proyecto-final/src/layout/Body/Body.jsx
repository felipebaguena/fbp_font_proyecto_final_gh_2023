import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from '../Home/HomePage';

export const Body = () => {
    return (
      <>
          <Routes>
          <Route path = '/' element = {<HomePage/>}/>
          </Routes>
    </>
  )
}