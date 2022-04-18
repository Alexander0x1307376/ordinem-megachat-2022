import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Login from './components/pages/Login';
import { AnimatePresence, motion } from 'framer-motion';
import Groups from './components/pages/Groups';
import Contacts from './components/pages/Contacts';
import Settings from './components/pages/Settings';
import Group from './components/pages/Group';
import Chat from './components/pages/Chat';
import Dashboard from './components/pages/Dashboard';
import Register from './components/pages/Register';


const animatePages = {
  initial: { 
    opacity: 0,
    x: -200
  },
  animate: { 
    opacity: 1,
    x: 0
  },
  exit: { 
    opacity: 0, 
    x: 200
  },
  transition: {
    duration: .09
  }
}

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className='w-screen h-screen overflow-hidden'>
      <AnimatePresence exitBeforeEnter>

        <Routes location={location} key={location.pathname}>

          <Route path='/' element={
            <MainLayout />
          }>

            <Route path='/' element={
              <motion.div 
                {...animatePages}
              ><Dashboard /></motion.div>
              // <div>Main default</div>
            } />
            <Route path='/groups' element={
              <motion.div 
                {...animatePages} 
              >
                <Groups />
              </motion.div>
              // <Groups />
            } />
            <Route path='/contacts' element={
              <motion.div 
                {...animatePages}
              >
                <Contacts />
              </motion.div>
              // <Contacts />
            } />
            <Route path='/settings' element={
              <motion.div 
                {...animatePages}
              >
                <Settings />
              </motion.div>
              // <Settings />
            } />

          </Route>

          <Route path='/group/:groupId' element={
            <motion.div {...animatePages}><Group /></motion.div>
            // <Group />
          } />

          <Route path='/chat/:chatId' element={
            <motion.div {...animatePages}><Chat /></motion.div>
            // <Chat />
          } />

          <Route path='/login' element={
            <Login />
          } />

          <Route path='/register' element={
            <Register />
          } />


        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
