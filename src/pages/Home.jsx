import { Carousel } from "antd";
import NFTCard from "../components/NFTCard";
import Timer from "../components/Timer";
import ImageUpload from "../components/ImageUpload";

function Home() {
  const carousel = [
    "/public/banner1.jpg",
    "/public/banner2.jpg",
    "/public/banner3.jpg",
  ];

  return (
    <div>
      {/* <div className="w-2/3">
        <Carousel autoplay arrows infinite={false}>
          {carousel.map((item, index) => (
            <img
              src={item}
              alt={`Banner ${index + 1}`}
              key={index}
            //   className="w-auto h-auto"
            />
          ))}
        </Carousel>
      </div> */}
      <main className="container mx-auto p-6">
        <NFTCard />
        <Timer />
        <ImageUpload/>
      </main>
    </div>
  );
}

export default Home;
