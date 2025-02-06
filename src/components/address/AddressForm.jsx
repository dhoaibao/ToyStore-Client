import { useEffect, useState } from "react";
import { Form, Input, Select, Button, Checkbox, Drawer, message } from "antd";
import { MapPin } from "lucide-react";
import PropTypes from "prop-types";
import { GHNService } from "../../services";
import { addAddress, updateAddress } from "../../redux/thunks/addressThunk";
import { useDispatch, useSelector } from "react-redux";
import getCurrentLocation from "../../utils/getCurrentLocation";

const AddressForm = ({ open, setOpen, editingAddress, setEditingAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [loadingGetLocation, setLoadingGetLocation] = useState(false);
  const [form] = Form.useForm();

  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.address.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (editingAddress) {
      setSelectedProvinceId(editingAddress.provinceId);
      setSelectedDistrictId(editingAddress.districtId);
      form.setFieldsValue(
        editingAddress || { addressName: "", address: "", phone: "" }
      );
    }
  }, [editingAddress, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provincesResponse = await GHNService.getProvinces();
        setProvinces(provincesResponse.data);

        if (selectedProvinceId) {
          const districtsResponse = await GHNService.getDistricts(
            selectedProvinceId
          );
          setDistricts(districtsResponse.data);
        }

        if (selectedDistrictId) {
          const wardsResponse = await GHNService.getWards(selectedDistrictId);
          setWards(wardsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu.");
      }
    };

    fetchData();
  }, [selectedProvinceId, selectedDistrictId, dispatch]);

  const getProvinceId = (provinceName) => {
    return provinces.find((p) => p.ProvinceName === provinceName).ProvinceID;
  };

  const getDistrictId = (districtName) => {
    return districts.find((d) => d.DistrictName === districtName).DistrictID;
  };

  const getWardCode = (wardName) => {
    return wards.find((w) => w.WardName === wardName).WardCode;
  };

  const getLocation = async () => {
    try {
      setLoadingGetLocation(true);
      const address = await getCurrentLocation();

      if (!address) {
        message.error("Không thể lấy địa chỉ từ tọa độ!");
        setLoadingGetLocation(false);
        return;
      }

      setSelectedProvinceId(address.provinceId);
      setSelectedDistrictId(address.districtId);

      form.setFieldsValue({
        provinceName: address.provinceName,
        districtName: address.districtName,
        wardName: address.wardName,
        detail: address.detail,
      });

      message.success("Lấy địa chỉ thành công!");
    } catch (err) {
      console.error("Error getting location:", err);
      message.error("Không thể chuyển tọa độ thành địa chỉ.");
      setLoadingGetLocation(false);
    } finally {
      setLoadingGetLocation(false);
    }
  };

  const handleProvinceChange = (value) => {
    const provinceId = getProvinceId(value);
    setSelectedProvinceId(provinceId);
    setDistricts([]);
    setSelectedDistrictId(null);
    setWards([]);
    form.setFieldsValue({ districtName: null, wardName: null });
  };

  const handleDistrictChange = (value) => {
    const districtId = getDistrictId(value);
    setSelectedDistrictId(districtId);
    setWards([]);
    form.setFieldsValue({ wardName: null });
  };

  const closeDrawer = () => {
    setOpen(false);
    form.resetFields();
    setEditingAddress(null);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        const newValues = {
          ...values,
          provinceId: getProvinceId(values.provinceName),
          districtId: getDistrictId(values.districtName),
          wardCode: getWardCode(values.wardName),
          userId: user.userId,
        };

        try {
          if (editingAddress) {
            await dispatch(
              updateAddress({
                ...newValues,
                addressId: editingAddress.addressId,
              })
            );
            message.success("Chỉnh sửa địa chỉ thành công!");
          } else {
            await dispatch(addAddress(newValues));
            message.success("Thêm địa chỉ mới thành công!");
          }
          closeDrawer();
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

  return (
    <Drawer
      title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
      open={open}
      onClose={closeDrawer}
      width={400}
      footer={
        <div className="text-right">
          <Button onClick={closeDrawer} className="mr-2">
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} type="primary" loading={loading}>
            {editingAddress ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </div>
      }
    >
      <div className="text-right">
        <Button onClick={getLocation} loading={loadingGetLocation}>
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
          rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
        >
          <Select
            placeholder="Chọn tỉnh/thành phố"
            onChange={(value) => handleProvinceChange(value)}
          >
            {provinces.map((province) => (
              <Select.Option
                key={province.ProvinceName}
                value={province.ProvinceName}
              >
                {province.ProvinceName}
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
            disabled={!selectedProvinceId}
          >
            {districts.map((district) => (
              <Select.Option
                key={district.DistrictName}
                value={district.DistrictName}
              >
                {district.DistrictName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Xã/Phường"
          name="wardName"
          rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}
        >
          <Select placeholder="Chọn xã/phường" disabled={!selectedDistrictId}>
            {wards.map((ward) => (
              <Select.Option key={ward.WardName} value={ward.WardName}>
                {ward.WardName}
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
          rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
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
  );
};

AddressForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  editingAddress: PropTypes.object.isRequired,
  setEditingAddress: PropTypes.func.isRequired,
};

export default AddressForm;
