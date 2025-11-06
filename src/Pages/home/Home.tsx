import HomeCarousel from "../../Component/carousels/homeCarousel/HomeCarousel";
import ErrorBoundry from "../../error/ErrorBoundry";
import Product from "../product/Product";

const Home = () => {
  return (
    <>
      <ErrorBoundry>
        <HomeCarousel />
      </ErrorBoundry>

      <ErrorBoundry>
        <Product />
      </ErrorBoundry>
    </>
  );
};

export default Home;
