// import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Product from '../pages/Product';
import About from '../pages/About';
import PuzzleGame from '../pages/PuzzleGame';

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
  {
    id: "products",
    path: "/products",
    element: <Product />,
  },
  {
    id: "about",
    path: "/about",
    element: <About />,
  },
  {
    id: "game",
    path: "/game",
    element: <PuzzleGame />,
  },
];

export default routes;