import { useState, useEffect } from "react";
import { Checkbox, Radio } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { brandService, categoryService } from "../../services";

const Filter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAllCategories();
        const categoryNames = result.data.map(
          (category) => category.categoryName
        );
        setCategories(categoryNames);
        console.log("Categories: ", categoryNames);
      } catch (error) {
        console.log("Failed to fetch categories: ", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const result = await brandService.getAllBrands();
        const brandNames = result.data.map((brand) => brand.brandName);
        setBrands(brandNames);
      } catch (error) {
        console.log("Failed to fetch brands: ", error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const ageOptions = [
    { label: "12 tuổi trở lên", value: "12" },
    { label: "6-12 tuổi", value: "6-12" },
    { label: "3-6 tuổi", value: "3-6" },
    { label: "1-3 tuổi", value: "1-3" },
  ];

  const priceOptions = [
    { label: "Dưới 200.000đ", value: "0-200000" },
    { label: "200.000đ - 500.000đ", value: "200000-500000" },
    { label: "500.000đ - 1.000.000đ", value: "500000-1000000" },
    { label: "Trên 1.000.000đ", value: "1000000" },
  ];

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);

    if (checkedValues.length === 0) {
      searchParams.delete("categoryNames");
    } else {
      searchParams.set("categoryNames", checkedValues.join(","));
    }

    navigate({ search: searchParams.toString() });
  };

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);

    if (checkedValues.length === 0) {
      searchParams.delete("brandNames");
    } else {
      searchParams.set("brandNames", checkedValues.join(","));
    }

    navigate({ search: searchParams.toString() });
  };

  const handleAgeChange = (e) => {
    setSelectedAge(e.target.value);
    searchParams.set("ageOption", e.target.value);
    navigate({ search: searchParams.toString() });
  };

  const handlePriceOptionChange = (e) => {
    setSelectedPriceOption(e.target.value);
    searchParams.set("priceOption", e.target.value);
    navigate({ search: searchParams.toString() });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedAge(null);
    setSelectedPriceOption(null);
    navigate({ search: "" });
  };

  return (
    <div className="relative">
      <button
        className="absolute z-10 top-0 right-0 text-sm text-red-600"
        onClick={handleClearFilters}
      >
        Xóa bộ lọc
      </button>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Mức giá</h3>
        <Radio.Group
          onChange={handlePriceOptionChange}
          value={selectedPriceOption}
          options={priceOptions}
          className="flex flex-col space-y-2"
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
        <Checkbox.Group
          options={categories}
          className="flex flex-col space-y-2"
          value={selectedCategories}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Thương hiệu</h3>
        <Checkbox.Group
          options={brands}
          className="flex flex-col space-y-2"
          value={selectedBrands}
          onChange={handleBrandChange}
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Độ tuổi</h3>
        <Radio.Group
          options={ageOptions}
          className="flex flex-col space-y-2"
          value={selectedAge}
          onChange={handleAgeChange}
        />
      </div>
    </div>
  );
};

export default Filter;
