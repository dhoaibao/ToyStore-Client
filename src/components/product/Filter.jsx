import { Checkbox, Slider } from "antd";

const Filter = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <Slider range defaultValue={[20, 80]} className="mb-4" />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <Checkbox.Group
          options={["Electronics", "Fashion", "Home"]}
          className="flex flex-col"
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Rating</h3>
        <Checkbox.Group
          options={["4 stars & up", "3 stars & up", "2 stars & up"]}
          className="flex flex-col"
        />
      </div>
    </div>
  );
};

export default Filter;
