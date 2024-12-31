const AboutPage = () => {
  return (
    <div className="container mx-auto">
      {/* Banner */}
      <section className="relative mb-12">
        <img
          src="https://via.placeholder.com/1200x400"
          alt="About Us Banner"
          className="w-full rounded-lg shadow-xl"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white bg-black bg-opacity-50 px-8 py-4 rounded-lg">
          <h2 className="text-4xl font-bold">Chào Mừng Đến Với ToyStore</h2>
          <p className="mt-4 text-lg">Niềm Vui Trẻ Thơ Bắt Đầu Tại Đây</p>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Về Chúng Tôi
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto text-lg leading-relaxed">
          ToyStore là cửa hàng đồ chơi hàng đầu với sứ mệnh mang lại niềm vui và
          sự sáng tạo cho trẻ em. Chúng tôi cung cấp các sản phẩm chất lượng
          cao, an toàn và sáng tạo, giúp trẻ em khám phá thế giới một cách thú
          vị và bổ ích.
        </p>
      </section>

      {/* Team Section */}
      <section className="mb-16 bg-gray-100 py-12 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Giá Trị Cốt Lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <img
              src="https://via.placeholder.com/100"
              alt="Safety Icon"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">An Toàn</h3>
            <p className="text-gray-600 mt-2">
              Cam kết cung cấp sản phẩm an toàn, được kiểm định chất lượng.
            </p>
          </div>
          <div className="text-center bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <img
              src="https://via.placeholder.com/100"
              alt="Innovation Icon"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Sáng Tạo</h3>
            <p className="text-gray-600 mt-2">
              Đồ chơi sáng tạo giúp trẻ em phát triển tư duy và khám phá thế
              giới.
            </p>
          </div>
          <div className="text-center bg-white border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <img
              src="https://via.placeholder.com/100"
              alt="Customer Icon"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Khách Hàng</h3>
            <p className="text-gray-600 mt-2">
              Đặt khách hàng làm trung tâm, mang đến trải nghiệm tuyệt vời.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
