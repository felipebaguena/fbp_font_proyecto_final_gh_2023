import React from 'react';

import { Routes, Route, Navigate } from "react-router-dom";
import { UserList } from '../AdminUsers/AdminUsers';
import { BattlePage } from '../Battle/Battle';
import { HeroPage } from '../Heroes/HeroPage';
import { HomePage } from '../Home/HomePage';
import { MonsterDex } from '../MonsterDex/MonsterDex';
import { HeroesAndItems } from '../Profile/MyHeroes';
import { UserProfile } from '../Profile/Profile';
import { StoryMode } from '../StoryMode/StoryMode';


export const Body = () => {
    return (
      <>
          <Routes>
          <Route path = '/' element = {<HomePage/>}/>
          <Route path = '/users' element = {<UserList/>}/>
          <Route path = '/heroes' element = {<HeroPage/>}/>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/myheroes" element={<HeroesAndItems />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/monsterdex/:heroId" element={<MonsterDex />} />
          <Route path="/storymode" element={<StoryMode />} />
          </Routes>
    </>
  )
}