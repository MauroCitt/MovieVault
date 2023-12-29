import { Navigate, Route, useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({user, children}) => {
  console.log("user" + user);
  if(!user){
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default ProtectedRoute;