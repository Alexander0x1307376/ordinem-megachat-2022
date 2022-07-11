import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserFromLocalStorage } from "../../utils/authUtils";



const ProtectedRoute: React.FC = ({children}) => {

  const location = useLocation();
  const user = useMemo(() => {
    const userStorageData = getUserFromLocalStorage();
    console.log('ProtectedRoute', userStorageData, location);
    return userStorageData;
  }, [location.key]);

  if (user)
    return <>{children}</>;
  else
    return <Navigate to='/login' />
}
export default ProtectedRoute;