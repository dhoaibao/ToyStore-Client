const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      {/* Phần thông tin và liên kết */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Về Chúng Tôi</h3>
          <p className="text-sm text-gray-400">
            MyKingdom - Thế giới đồ chơi an toàn, phát triển trí tuệ cho trẻ em.
          </p>
        </div>

        {/* Cột 2: Điều hướng */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Danh Mục</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:text-red-500">Hàng Mới</a></li>
            <li><a href="#" className="hover:text-red-500">Sản Phẩm</a></li>
            <li><a href="#" className="hover:text-red-500">Khuyến Mãi</a></li>
            <li><a href="#" className="hover:text-red-500">Chương Trình Thành Viên</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ Trợ */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Hỗ Trợ</h3>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:text-red-500">Chính Sách Bảo Mật</a></li>
            <li><a href="#" className="hover:text-red-500">Điều Khoản Sử Dụng</a></li>
            <li><a href="#" className="hover:text-red-500">Câu Hỏi Thường Gặp</a></li>
            <li><a href="#" className="hover:text-red-500">Liên Hệ</a></li>
          </ul>
        </div>

        {/* Cột 4: Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Kết Nối Với Chúng Tôi</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-red-500">
              <i className="fab fa-facebook fa-lg"></i>
            </a>
            <a href="#" className="hover:text-red-500">
              <i className="fab fa-instagram fa-lg"></i>
            </a>
            <a href="#" className="hover:text-red-500">
              <i className="fab fa-youtube fa-lg"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className="bg-gray-900 py-4 text-center text-sm text-gray-400">
        © 2024 MyKingdom. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;