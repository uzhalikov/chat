import React from "react";
import { Routes, Route } from 'react-router-dom';
import { useState, createContext  } from "react";
import { Chat } from './../pages/Chat/Chat';
import { Start } from './../pages/Start/Start';
import { CreateOrConnect } from '../pages/CreateOrConnect/CreateOrConnect';

export const ContextData = createContext()

const AppRoutes = () => {
    const [userData, setUserData] = useState({'name': '', 'room': ''})

    return (
        <ContextData.Provider value={{userData: userData, setUserData: setUserData}}>
            <Routes>
                <Route path='/' element={<Start/>}/>
                <Route path='/create' element={<CreateOrConnect/>}/>
                <Route path='/connect' element={<CreateOrConnect/>}/>
                <Route path='/chat' element={<Chat/>}/>
            </Routes>
        </ContextData.Provider>
    )
}
export default AppRoutes