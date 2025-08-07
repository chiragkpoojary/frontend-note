import { useState, useEffect } from 'react';
import CreateNote from "./components/CreateNote";
import Search from "./components/NavSearch";
import {  Route, Routes } from "react-router-dom";
import Note from "./components/Note";
import NotesList from "./components/Notelist";
import { RecoilRoot } from 'recoil';
import ReactLoading from 'react-loading';
import Footer from "./components/footer"
import Register from "./components/Register"
import Login from './components/Login';
import NotFound from './components/error';
import {ProfileMenu} from './components/profile';


import {useAutoLogout} from "./utils/autologout.ts"

import MailResetPassword from './components/MailResetPassword.tsx';
import ResetPassword from "./components/resetPassword.tsx";
import Visits from "./components/vists.tsx";
function App1() {
    const [isServerReady, setIsServerReady] = useState(false);
  function checkServerStatus() {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/health`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setIsServerReady(true);
        }
      })
      .catch(error => {
        console.error('Error checking server status:', error);
      });
  }
    useAutoLogout();
  useEffect(() => {
   checkServerStatus();
  }, []);

  if (!isServerReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ReactLoading type={'spin'} color={'#000000'} height={100} width={100} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen`}>

      <RecoilRoot>

        <Routes>
          <Route path="/" element={<div> <Visits /><div className="flex  justify-end items-center gap-10 sm:mr-16 mt-5 mr-5">
            <Search />
            <ProfileMenu /> 

            </div>
            <CreateNote />
              <NotesList/> <Footer /></div>} />
          <Route path="/Note" element={<Note />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
            <Route path="/forgotpass" element={<MailResetPassword />}/>
            <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </RecoilRoot>

    </div>
  );
}

function App() {

  return <App1 />;
}

export default App;
