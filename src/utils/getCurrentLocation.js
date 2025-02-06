import { message } from 'antd';
import axios from 'axios';
import { GHNService } from '../services';

const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
        message.error("Trình duyệt không hỗ trợ Geolocation!");
        return null;
    }

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoordinates(latitude, longitude);
        if (!address) return null;

        const provinces = await GHNService.getProvinces();
        const province = provinces.data.find((province) =>
            province.ProvinceName.includes(address.city || address.state)
        );

        if (!province) {
            message.error("Không tìm thấy tỉnh tương ứng với địa chỉ.");
            return null;
        }

        const districts = await GHNService.getDistricts(province.ProvinceID);
        const districtName = address.suburb.replace(" District", "");
        const district = districts.data.find((district) =>
            district.DistrictName.includes(districtName)
        );

        if (!district) {
            message.error("Không tìm thấy quận tương ứng với địa chỉ.");
            return null;
        }

        const wards = await GHNService.getWards(district.DistrictID);
        const ward = wards.data.find((ward) =>
            ward.WardName.includes(address.quarter || address.village)
        );

        if (!ward) {
            message.error("Không tìm thấy phường tương ứng với địa chỉ.");
            return null;
        }

        return {
            provinceId: province.ProvinceID,
            districtId: district.DistrictID,
            wardCode: ward.wardCode,
            provinceName: province.ProvinceName,
            districtName: district.DistrictName,
            wardName: ward.WardName,
            detail: address.road || "",
        };
    } catch (err) {
        console.error("Lỗi khi lấy vị trí:", err.message);
        message.error("Không thể lấy vị trí hiện tại.");
        return null;
    }
};

const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        if (response.data && response.data.address) {
            console.log("Địa chỉ hiện tại:", response.data.address);
            return response.data.address;
        } else {
            throw new Error("Không có dữ liệu địa chỉ hợp lệ.");
        }
    } catch (err) {
        console.error("Lỗi khi lấy địa chỉ:", err);
        message.error("Không thể chuyển tọa độ thành địa chỉ.");
        return null;
    }
};

export default getCurrentLocation;