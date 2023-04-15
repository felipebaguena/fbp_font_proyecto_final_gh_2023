import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";
import { UserList } from '../AdminUsers/AdminUsers';
import { HomePage } from '../Home/HomePage';

export const Body = () => {
    return (
      <>
          <Routes>
          <Route path = '/' element = {<HomePage/>}/>
          <Route path = '/users' element = {<UserList/>}/>
          </Routes>
    </>
  )
}