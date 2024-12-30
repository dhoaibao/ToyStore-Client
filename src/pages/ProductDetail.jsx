import { useState } from "react";
import { Button, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const ProductDetail = () => {
  return (
    <div>
      <div className="px-4 py-2 bg-gray-200">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              href: "/products",
              title: "Sản phẩm",
            },
            {
              title: "abc",
            },
          ]}
        />
      </div>
      <div className="p-4 bg-gray-100">
          
      </div>
    </div>
  );
};

export default ProductDetail;
