import React from 'react';
import { routes } from './routes/routes';
import { useLocation, useRoutes } from 'react-router-dom';

const App: React.FC = () => {
  const location = useLocation();
  const elements = useRoutes(routes, location);
  return (elements);
}

export default App;
