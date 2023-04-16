import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";
import { UserList } from '../AdminUsers/AdminUsers';
import { HomePage } from '../Home/HomePage';
import { UserProfile } from '../Profile/Profile';


export const Body = () => {
    return (
      <>
          <Routes>
          <Route path = '/' element = {<HomePage/>}/>
          <Route path = '/users' element = {<UserList/>}/>
          <Route path="/profile" element={<UserProfile />} />
          </Routes>
    </>
  )
}