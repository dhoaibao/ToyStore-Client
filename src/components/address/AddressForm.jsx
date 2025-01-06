import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const AddressForm = ({
  form,
  provinces,
  districts,
  wards,
  onProvinceChange,
  onDistrictChange,
  isProvinceSelected,
  isDistrictSelected,
}) => (
  <Form form={form} layout="vertical">
    <Form.Item
      label="Tên địa chỉ"
      name="addressName"
      rules={[{ required: true, message: "Vui lòng nhập tên địa chỉ!" }]}
    >
      <Input placeholder="Ví dụ: Nhà riêng, Văn phòng" />
    </Form.Item>
    <Form.Item
      label="Tỉnh/Thành phố"
      name="provinceName"
      rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
    >
      <Select placeholder="Chọn tỉnh/thành phố" onChange={onProvinceChange}>
        {provinces.map((province) => (
          <Select.Option key={province.name} value={JSON.stringify(province)}>
            {province.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      label="Quận/Huyện"
      name="districtName"
      rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
    >
      <Select
        placeholder="Chọn quận/huyện"
        onChange={onDistrictChange}
        disabled={!isProvinceSelected}
      >
        {districts.map((district) => (
          <Select.Option key={district.name} value={JSON.stringify(district)}>
            {district.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      label="Xã/Phường"
      name="wardName"
      rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}
    >
      <Select placeholder="Chọn xã/phường" disabled={!isDistrictSelected}>
        {wards.map((ward) => (
          <Select.Option key={ward.name} value={JSON.stringify(ward)}>
            {ward.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      label="Địa chỉ chi tiết"
      name="detail"
      rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết!" }]}
    >
      <Input placeholder="Ví dụ: Số nhà, tên đường,..." />
    </Form.Item>
    <Form.Item
      label="Tên người nhận"
      name="contactName"
      rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
    >
      <Input placeholder="Nhập tên người nhận" />
    </Form.Item>
    <Form.Item
      label="Số điện thoại"
      name="contactPhone"
      rules={[
        { required: true, message: "Vui lòng nhập số điện thoại!" },
        { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
      ]}
    >
      <Input placeholder="Nhập số điện thoại liên hệ" />
    </Form.Item>
  </Form>
);

AddressForm.propTypes = {
  form: PropTypes.object.isRequired,
  provinces: PropTypes.array.isRequired,
  districts: PropTypes.array.isRequired,
  wards: PropTypes.array.isRequired,
  onProvinceChange: PropTypes.func.isRequired,
  onDistrictChange: PropTypes.func.isRequired,
  isProvinceSelected: PropTypes.bool.isRequired,
  isDistrictSelected: PropTypes.bool.isRequired,
};

export default AddressForm;
