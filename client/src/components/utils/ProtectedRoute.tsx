import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../../utils/authUtils";



const ProtectedRoute: React.FC = ({children}) => {

  const user = useMemo(getUserFromLocalStorage, []);

  if (user)
    return <>{children}</>;
  else
    return <Navigate to='/login' />
}
export default ProtectedRoute;