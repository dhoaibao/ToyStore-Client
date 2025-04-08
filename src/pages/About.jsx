import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const AboutPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="px-4 py-2 rounded-sm bg-primary">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Giới thiệu",
            },
          ]}
        />
      </div>
      <div className="max-w-7xl mx-auto p-6 text-gray-800">
        {/* Banner giới thiệu */}
        <section className="relative mb-12">
          <img
            src="/about_banner.png"
            alt="About Banner"
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center rounded-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Chào Mừng Đến Với ToyStore
            </h1>
            <p className="text-lg md:text-xl text-white">
              Nơi khơi nguồn niềm vui và trí tưởng tượng của trẻ thơ
            </p>
          </div>
        </section>

        {/* Giới thiệu chung */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">Về Chúng Tôi</h2>
          <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto leading-relaxed">
            ToyStore là cửa hàng đồ chơi hàng đầu, cam kết mang đến cho trẻ em
            những món đồ chơi an toàn, sáng tạo và truyền cảm hứng. Chúng tôi
            tin rằng mỗi món đồ chơi là một cơ hội để học hỏi và khám phá thế
            giới.
          </p>
        </section>

        {/* Giá trị cốt lõi */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-10">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "An Toàn",
                desc: "Sản phẩm được kiểm định chất lượng, an toàn tuyệt đối cho trẻ nhỏ.",
                icon: "https://cdn-icons-png.flaticon.com/512/1046/1046870.png",
              },
              {
                title: "Sáng Tạo",
                desc: "Khơi gợi trí tưởng tượng và khả năng sáng tạo của trẻ.",
                icon: "https://cdn-icons-png.flaticon.com/512/2541/2541988.png",
              },
              {
                title: "Khách Hàng",
                desc: "Phục vụ tận tâm, đặt khách hàng làm trung tâm trong mọi hoạt động.",
                icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 text-center border-t-4 border-primary"
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
