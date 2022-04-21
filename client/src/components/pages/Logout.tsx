import React from "react";
import { Navigate } from 'react-router-dom';
import { clearUserData } from "../../utils/authUtils";

const Logout: React.FC = () => {

  clearUserData();

  return (
    <Navigate to='/login' />
  )
}

export default Logout;