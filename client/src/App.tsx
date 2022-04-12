import React from 'react';
import { Route, Routes, useLocation, useRoutes } from 'react-router-dom';
import Main from './components/pages/Main';
import { AnimatePresence, motion } from 'framer-motion';
import Groups from './components/pages/Groups';
import Contacts from './components/pages/Contacts';
import Settings from './components/pages/Settings';
import Group from './components/pages/Group';
import Chat from './components/pages/Chat';


const animationFadeInOut = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: .1
  }
}

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className='w-screen h-screen'>
      <AnimatePresence>

        <Routes location={location} key={location.pathname}>

          <Route path='/' element={
            <Main />
          }>

            <Route path='/' element={
              <motion.div {...animationFadeInOut}><div>Main default</div></motion.div>
            } />
            <Route path='/groups' element={
              <motion.div {...animationFadeInOut}><Groups /></motion.div>
            } />
            <Route path='/contacts' element={
              <motion.div {...animationFadeInOut}><Contacts /></motion.div>
            } />
            <Route path='/settings' element={
              <motion.div {...animationFadeInOut}><Settings /></motion.div>
            } />

          </Route>

          <Route path='/group/:groupId' element={
            <motion.div {...animationFadeInOut}><Group /></motion.div>
          } />

          <Route path='/chat/:chatId' element={
            <motion.div {...animationFadeInOut}><Chat /></motion.div>
          } />


        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
