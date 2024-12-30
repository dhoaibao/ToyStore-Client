import { useState } from "react";
import { Checkbox, Radio, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const Filter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRatings, setSelectedRatings] = useState(null);
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const updateQuery = (key, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);
    navigate({ search: searchParams.toString() });
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
    updateQuery("category", checkedValues.join(","));
  };

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
    updateQuery("brand", checkedValues.join(","));
  };

  const handleRatingChange = (e) => {
    setSelectedRatings(e.target.value);
    updateQuery("rating", e.target.value);
  };

  const handlePriceOptionChange = (e) => {
    setSelectedPriceOption(e.target.value);
    updateQuery("priceOption", e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings(null);
    setSelectedPriceOption(null);
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("category");
    searchParams.delete("brand");
    searchParams.delete("rating");
    searchParams.delete("priceOption");
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="relative">
      <button
        className="absolute z-10 top-0 right-0 text-xs text-red-600"
        onClick={handleClearFilters}
      >
        Xóa bộ lọc
      </button>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Mức giá</h3>
        <Radio.Group
          onChange={handlePriceOptionChange}
          value={selectedPriceOption}
        >
          <Space direction="vertical">
            <Radio value={"0-200000"}>Dưới 200.000đ</Radio>
            <Radio value={"200000-500000"}>200.000đ - 500.000đ</Radio>
            <Radio value={"500000-1000000"}>500.000đ - 1.000.000đ</Radio>
            <Radio value={"1000000"}>Trên 1.000.000đ</Radio>
          </Space>
        </Radio.Group>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
        <Checkbox.Group
          options={["Electronics", "Fashion", "Home"]}
          className="flex flex-col"
          value={selectedCategories}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Thương hiệu</h3>
        <Checkbox.Group
          options={["Brand A", "Brand B", "Brand C"]}
          className="flex flex-col"
          value={selectedBrands}
          onChange={handleBrandChange}
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Đánh giá</h3>
        <Radio.Group onChange={handleRatingChange} value={selectedRatings}>
          <Space direction="vertical">
            <Radio value="4">4 stars & up</Radio>
            <Radio value="3">3 stars & up</Radio>
            <Radio value="2">2 stars & up</Radio>
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
};

export default Filter;
