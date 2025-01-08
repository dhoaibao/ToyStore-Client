import { useState, useEffect, useMemo } from "react";
import {
  List,
  Button,
  Input,
  Drawer,
  Form,
  Typography,
  message,
  Select,
  Checkbox,
} from "antd";
import { MapPin } from "lucide-react";
import PropTypes from "prop-types";
import { addressService, openApi } from "../../services";
import { useSelector } from "react-redux";
import axios from "axios";
const { Title, Text } = Typography;

const AddressBook = ({ open, setOpen }) => {
  const [addresses, setAddresses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAddressByUser();
        setAddresses(response.data);
        console.log("addresses", response.data);
      } catch (error) {
        console.error("Failed to fetch addresses: ", error);
        message.error("Failed to fetch addresses");
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provincesData = await openApi.getProvinces();
        setProvinces(provincesData);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        message.error("Không thể tải danh sách tỉnh/thành phố.");
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) return;
      try {
        const districtsData = await openApi.getDistricts(selectedProvince);
        setDistricts(districtsData);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        message.error("Không thể tải danh sách quận/huyện.");
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return;
      try {
        const wardsData = await openApi.getWards(selectedDistrict);
        setWards(wardsData);
      } catch (error) {
        console.error("Failed to fetch wards:", error);
        message.error("Không thể tải danh sách xã/phường.");
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  const getProvinceCode = (provinceName) => {
    return provinces.find((p) => p.name === provinceName).code;
  };

  const getDistrictCode = (districtName) => {
    return districts.find((d) => d.name === districtName).code;
  };

  const getWardCode = (wardName) => {
    return wards.find((w) => w.name === wardName).code;
  };

  const getLocation = async () => {
    try {
      setLoading(true);

      if (!navigator.geolocation) {
        message.error("Trình duyệt không hỗ trợ Geolocation.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await getAddressFromCoordinates(latitude, longitude); // Chuyển tọa độ thành địa chỉ
        },
        (err) => {
          console.error("Lỗi khi lấy vị trí:", err.message);
          message.error("Không thể lấy vị trí hiện tại.");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error getting location:", err);
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      console.log("latitude", latitude);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      const { address } = response.data;

      console.log("address", address);

      const province = provinces.find((province) =>
        province.name.includes(address.city || address.state)
      );

      setSelectedProvince(province.code);
      const districtsData = await openApi.getDistricts(province.code);

      const districtName = address.suburb.replace(" District", "");
      const district = districtsData.find((district) =>
        district.name.includes(districtName)
      );

      setSelectedDistrict(district.code);
      const wardsData = await openApi.getWards(district.code);

      const ward = wardsData.find((ward) =>
        ward.name.includes(address.quarter || address.village)
      );

      form.setFieldsValue({
        provinceName: province.name,
        districtName: district.name,
        wardName: ward.name,
        detail: address.road || "",
      });

      message.success("Lấy địa chỉ thành công!");
    } catch (err) {
      console.error("Error fetching address:", err);
      message.error("Không thể chuyển tọa độ thành địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  const addressString = useMemo(
    () => (address) =>
      `${address.detail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
    []
  );

  const handleProvinceChange = (value) => {
    const provinceCode = getProvinceCode(value);
    setSelectedProvince(provinceCode);
    setDistricts([]);
    setSelectedDistrict(null);
    setWards([]);
    form.setFieldsValue({ districtName: null, wardName: null });
  };

  const handleDistrictChange = (value) => {
    const districtCode = getDistrictCode(value);
    setSelectedDistrict(districtCode);
    setWards([]);
    form.setFieldsValue({ wardName: null });
  };

  const openAddressDrawer = (address = null) => {
    console.log("address", address);
    setEditingAddress(address);
    setSelectedProvince(address?.provinceCode);
    setSelectedDistrict(address?.districtCode);
    setIsDrawerOpen(true);
    form.setFieldsValue(address || { addressName: "", address: "", phone: "" });
  };

  const closeDrawer = () => {
    setEditingAddress(null);
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleChangeDefault = async (addressId) => {
    setAddresses((prev) =>
      prev.map((item) =>
        item.addressId === addressId
          ? { ...item, isDefault: true }
          : { ...item, isDefault: false }
      )
    );
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        const newValues = {
          ...values,
          provinceCode: getProvinceCode(values.provinceName),
          districtCode: getDistrictCode(values.districtName),
          wardCode: getWardCode(values.wardName),
          userId: user.userId,
        };

        try {
          if (editingAddress) {
            setAddresses((prev) =>
              prev.map((item) =>
                item.addressId === editingAddress.addressId
                  ? { ...item, ...newValues }
                  : item
              )
            );
            message.success("Chỉnh sửa địa chỉ thành công!");
            closeDrawer();
            if (newValues.isDefault) {
              handleChangeDefault(editingAddress.addressId);
            }
            await addressService.updateAddress(
              editingAddress.addressId,
              newValues
            );
          } else {
            const response = await addressService.addAddress(newValues);
            const newAddress = {
              addressId: response.data.addressId,
              ...newValues,
            };
            setAddresses((prev) => [...prev, newAddress]);
            message.success("Thêm địa chỉ mới thành công!");
            closeDrawer();
            if (newValues.isDefault) {
              handleChangeDefault(response.data.addressId);
            }
          }
        } catch (error) {
          console.error("Failed to save address: ", error);
          message.error("Failed to save address");
        }
      })
      .catch((error) => {
        message.error("Vui lòng kiểm tra lại thông tin!");
        console.log("Validation error:", error);
      });
  };

  const handleDelete = async (addressId) => {
    try {
      await addressService.deleteAddress(addressId);
      setAddresses((prev) =>
        prev.filter((item) => item.addressId !== addressId)
      );
      message.success("Xóa địa chỉ thành công!");
    } catch (error) {
      console.error("Failed to delete address: ", error);
      message.error("Xóa địa chỉ thất bại!");
    }
  };

  return (
    <Drawer
      closable={false}
      title={<Title level={3}>Sổ quản lý địa chỉ</Title>}
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
            Đóng
          </Button>
        </div>
      }
    >
      <Button
        type="primary"
        onClick={() => openAddressDrawer()}
        style={{ marginBottom: "20px" }}
      >
        Thêm địa chỉ mới
      </Button>
      <List
        bordered
        dataSource={addresses}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="link"
                onClick={() => openAddressDrawer(item)}
              >
                Chỉnh sửa
              </Button>,
              <Button
                key="delete"
                type="link"
                danger
                onClick={() => handleDelete(item.addressId)}
              >
                Xóa
              </Button>,
            ]}
          >
            <div>
              <Text strong>{item.addressName}</Text>
              <br />
              <Text>{addressString(item)}</Text>
              <br />
              <Text>SĐT: {item.contactPhone}</Text>
              <br />
              {item.isDefault && (
                <Text strong className="text-primary">
                  Địa chỉ mặc định
                </Text>
              )}
            </div>
          </List.Item>
        )}
      />
      <Drawer
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isDrawerOpen}
        onClose={closeDrawer}
        width={400}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSave} type="primary">
              {editingAddress ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        }
      >
        <div className="text-right">
          <Button onClick={getLocation} loading={loading}>
            <MapPin size={20} color="red" strokeWidth={1} />
            Sử dụng vị trí hiện tại
          </Button>
        </div>
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
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
            ]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
              onChange={(value) => handleProvinceChange(value)}
            >
              {provinces.map((province) => (
                <Select.Option key={province.name} value={province.name}>
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
              onChange={(value) => handleDistrictChange(value)}
              disabled={!selectedProvince}
            >
              {districts.map((district) => (
                <Select.Option key={district.name} value={district.name}>
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
            <Select placeholder="Chọn xã/phường" disabled={!selectedDistrict}>
              {wards.map((ward) => (
                <Select.Option key={ward.name} value={ward.name}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ chi tiết"
            name="detail"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ chi tiết!" },
            ]}
          >
            <Input placeholder="Ví dụ: Số nhà, tên đường,..." />
          </Form.Item>
          <Form.Item
            label="Tên người nhận"
            name="contactName"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận!" },
            ]}
          >
            <Input placeholder="Nhập tên người nhận" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="contactPhone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại liên hệ" />
          </Form.Item>
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>
        </Form>
      </Drawer>
    </Drawer>
  );
};

AddressBook.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AddressBook;
