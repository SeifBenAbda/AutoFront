import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface PrivateRouteProps {
  path: string;
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Route {...rest} element={element} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
