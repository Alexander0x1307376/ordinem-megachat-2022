import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Login from './components/pages/Login';
import Groups from './components/pages/Groups';
import Contacts from './components/pages/Contacts';
import Settings from './components/pages/Settings';
import Group from './components/pages/Group';
import DirectChat from './components/pages/DirectChat';
import Dashboard from './components/pages/Dashboard';
import Register from './components/pages/Register';
import Logout from './components/pages/Logout';
import ProtectedRoute from './components/utils/ProtectedRoute';
import CreateGroup from './components/pages/CreateGroup';
import ChannelChat from './components/pages/ChannelChat';
import useRealtimeSystemEmitter from './features/realtimeSystem/useRealtimeSystemEmitter';
import { useFriendRequestsQuery } from './features/friendshipSystem/friendRequestsService';
import { useFriendsQuery } from './features/users/usersService';


const App: React.FC = () => {

  const location = useLocation();

  const realtimeEmitter = useRealtimeSystemEmitter();
  const { data: requests, isLoading: isRequestsLoading } = useFriendRequestsQuery();
  const { data: friends, isLoading: isFriendsLoading } = useFriendsQuery();


  useEffect(() => {
    if (realtimeEmitter.isSocketLoaded && friends && !isFriendsLoading) {

      realtimeEmitter.subscribeToChanges({
        users: friends.map(item => item.uuid)
      });
    }
  }, [realtimeEmitter, friends, isFriendsLoading]);


  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <Routes location={location}>

        <Route path='/' element={
          <ProtectedRoute><MainLayout /></ProtectedRoute>
        }>

          <Route path='/'
            key="dashboard"
            element={<Dashboard />}
          />
          <Route path='/groups'
            key="groups"
            element={<Groups />}
          />
          <Route path='/contacts'
            key="contacts"
            element={<Contacts />}
          />
          <Route path='/settings'
            key="settings"
            element={<Settings />}
          />

        </Route>

        <Route path='/group/:groupId' element={
          <ProtectedRoute><Group /></ProtectedRoute>
        }>
          <Route path=':channelId' element={
            <ChannelChat />
          } />
        </Route>

        <Route path='/chat/:chatId' element={
          <ProtectedRoute><DirectChat /></ProtectedRoute>
        } />



        <Route path='/group/create' element={
          <ProtectedRoute><CreateGroup /></ProtectedRoute>
        } />

        <Route path='/login' element={
          <Login />
        } />

        <Route path='/register' element={
          <Register />
        } />

        <Route path='/logout' element={
          <Logout />
        } />
      </Routes>
    </div>
  );
}

export default App;
