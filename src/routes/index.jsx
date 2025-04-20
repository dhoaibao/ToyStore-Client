// import ProtectedRoute from '../components/ProtectedRoute';
import Home from "../pages/Home";
import Product from "../pages/Product";
import About from "../pages/About";
import PuzzleGame from "../pages/PuzzleGame";
import ProductDetail from "../pages/ProductDetail";
import News from "../pages/News";
import Promotion from "../pages/Promotion";
import Search from "../pages/Search";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";

const routes = [
  {
    id: "home",
    path: "/",
    element: <Home />,
  },
  {
    id: "search",
    path: "/search",
    element: <Search />,
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
  {
    id: "product-detail",
    path: "/products/:slug",
    element: <ProductDetail />,
  },
  {
    id: "news",
    path: "/news",
    element: <News />,
  },
  {
    id: "checkout",
    path: "/checkout",
    element: <Checkout />,
  },
  {
    id: "promotion",
    path: "/promotions",
    element: <Promotion />,
  },
  {
    id: "order-success",
    path: "/order-success",
    element: <OrderSuccess />,
  },
];

export default routes;
