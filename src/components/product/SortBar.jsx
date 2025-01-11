import { useEffect, useState, useMemo } from "react";
import { Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const SortBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const [active, setActive] = useState("newest");

  useEffect(() => {
    const sort = searchParams.get("sort");
    setActive(sort || "");
  }, [searchParams]);

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
    searchParams.set(key, value);
    navigate({ search: searchParams.toString() });
  };

  const onChange = (value) => {
    updateQuery("sortPrice", value);
  };

  const options = [
    { label: "Mới Nhất", value: "newest" },
    { label: "Bán Chạy", value: "bestseller" },
  ];

  return (
    <div className="flex items-center space-x-2 shadow-md bg-white p-2 mb-3 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => updateQuery("sort", option.value)}
          className={`px-4 py-2 rounded-md text-sm ${
            active === option.value
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
