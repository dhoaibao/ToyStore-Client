// import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';

const routes = [
  {
    id: "home",
    path: "/",
    element: <Home/>,
  },
  {
    id: "login",
    path: "/login",
    element: <Login />,
  },
];

export default routes;