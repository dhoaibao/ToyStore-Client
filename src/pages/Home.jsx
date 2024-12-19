import { Carousel } from "antd";

function Home() {
  const carousel = [
    "/banner1.png",
    "/banner2.png",
    "/banner3.png",
  ];

  return (
    <div className="container mx-auto">
      <div className="w-full h-96 overflow-hidden">
        <Carousel autoplay arrows infinite={false}>
          {carousel.map((item, index) => (
            <div key={index} className="h-full">
              <img
                src={item}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default Home;
