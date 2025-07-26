import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoutes = ()=>{
  const token = Cookies.get('token');
  return token? <Outlet/>:<Navigate to="/login"/>
}
export default ProtectedRoutes;