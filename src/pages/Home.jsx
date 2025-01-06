import { Carousel } from "antd";
import ProductItem from "../components/product/ProductItem";
import VoucherSection from "../components/voucher/VoucherSection";

function Home() {
  const carousel = ["/banner1.png", "/banner2.png", "/banner3.png"];

  const categories = [
    {
      id: 1,
      name: "Robot",
      image:
        "https://www.mykingdom.com.vn/cdn/shop/files/4._Robot_-_628x288_55ccbc56-756c-4dee-af08-98651cde48c8.png?v=1733451894",
    },
    {
      id: 2,
      name: "Đồ chơi phương tiện",
      image:
        "https://www.mykingdom.com.vn/cdn/shop/files/5._D_ch_i_ph_ng_ti_n_-_628x288_f366fd94-8739-4f27-a689-8170881365df.png?v=1733451915",
    },
    {
      id: 3,
      name: "Đồ chơi mầm non",
      image:
        "https://www.mykingdom.com.vn/cdn/shop/files/1._D_ch_i_m_m_non_-_628x288_82c01078-814a-483f-8857-66f9c42238ed.png?v=1733451649",
    },
    {
      id: 4,
      name: "Đồ chơi lắp ghép",
      image:
        "https://www.mykingdom.com.vn/cdn/shop/files/3._D_ch_i_l_p_ghep_-_1280x360_6118024a-37c9-4858-9cbf-74c59a866221.png?v=1733451858",
    },
  ];

  const products = [
    {
      id: 1,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 2,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/76290.jpg?v=1727170924&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 3,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 4,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 5,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
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
      <VoucherSection/>
      {/* Featured Products */}
      <section className="mb-4 px-4">
        <hr className="my-4 border-gray-300" />
        <h2 className="text-3xl text-center font-bold text-primary mb-2">
          Sản phẩm nổi bật
        </h2>
        <span className="mb-6 bg-primary h-2 rounded flex justify-center w-[50vw] md:w-[30vw] mx-auto"></span>
        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductItem key={product.id} {...product} />
          ))}
        </div>
      </section>
      {/* Categories */}
      <section className="my-4 p-4">
        <hr className="my-4 border-gray-300" />
        <h2 className="text-3xl text-center text-primary font-bold mb-2">
          Danh mục sản phẩm
        </h2>
        <span className="mb-6 bg-primary h-2 rounded flex justify-center w-[50vw] md:w-[30vw] mx-auto"></span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-4 text-center shadow hover:shadow-md"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover mb-2 rounded-xl"
              />
              <h3 className="font-semibold text-xl">{category.name}</h3>
              <button className="mt-4 px-6 py-2 border-2 border-primary text-primary font-medium rounded-xl hover:bg-red-500 hover:text-white transition-all">
                Xem Thêm
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
