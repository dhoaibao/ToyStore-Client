import { useState } from "react";
import { Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const SortBar = () => {
  const [active, setActive] = useState("Mới Nhất");
  const navigate = useNavigate();
  const location = useLocation();

  const priceOptions = [
    {
      value: "default",
      label: "Mặc định",
    },
    {
      value: "asc",
      label: "Giá tăng dần",
    },
    {
      value: "desc",
      label: "Giá giảm dần",
    },
  ];

  const updateQuery = (key, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    navigate({ search: searchParams.toString() });
  };

  const onChange = (value) => {
    updateQuery("sortPrice", value);
  };

  const options1 = [
    { label: "Mới Nhất", value: "newest" },
    { label: "Bán Chạy", value: "bestseller" },
  ];

  const handleClick = (option) => {
    setActive(option.label);
    updateQuery("filter", option.value);
  };

  return (
    <div className="flex items-center space-x-2 shadow-md bg-white p-2 mb-3 rounded-lg">
      {options1.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option)}
          className={`px-4 py-2 rounded-md text-sm ${
            active === option.label
              ? "bg-primary text-white"
              : "bg-white border border-gray-300 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
      <Select
        defaultValue="default"
        options={priceOptions}
        onChange={onChange}
        placeholder="Mức giá"
        style={{
          width: "130px",
        }}
      />
    </div>
  );
};

export default SortBar;