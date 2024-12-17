import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import PropTypes from "prop-types";
import ScrollToTop from "react-scroll-to-top";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ScrollToTop
        smooth
        color="#000"
        className="fixed bottom-5 right-5 rounded-full border-2 border-primary bg-white shadow-lg w-12 h-12 flex items-center justify-center"
      />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
