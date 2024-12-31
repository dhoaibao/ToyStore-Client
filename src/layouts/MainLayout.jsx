import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import ScrollToTop from "../components/common/ScrollToTop";
import PropTypes from "prop-types";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">{children}</div>
      <ScrollToTop/>
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
