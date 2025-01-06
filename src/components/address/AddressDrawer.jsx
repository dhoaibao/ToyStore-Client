import { Drawer, Typography } from "antd";
import PropTypes from "prop-types";

const { Title } = Typography;

const AddressDrawer = ({ open, onClose, children, footer }) => (
  <Drawer
    closable={false}
    title={<Title level={3}>Sổ quản lý địa chỉ</Title>}
    open={open}
    onClose={onClose}
    width={600}
    footer={footer}
  >
    {children}
  </Drawer>
);

AddressDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
};

export default AddressDrawer;
