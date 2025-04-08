import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";

const socialIcons = [
  { Icon: Facebook, label: "Facebook", color: "hover:text-blue-600" },
  { Icon: Twitter, label: "Twitter", color: "hover:text-blue-400" },
  { Icon: Instagram, label: "Instagram", color: "hover:text-pink-500" },
  { Icon: Linkedin, label: "LinkedIn", color: "hover:text-blue-700" },
  { Icon: Github, label: "GitHub", color: "hover:text-black" },
];

const supportLinks = [
  "Hỗ trợ khách hàng",
  "Hỏi đáp",
  "Chính sách đổi trả",
  "Góp ý & Khiếu nại",
];
const mainLinks = [
  "Sản phẩm mới",
  "Bộ sưu tập nổi bật",
  "Dịch vụ bảo hành",
  "Tin tức mô hình",
];

const Footer = () => {
  return (
    <footer className="bg-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Section */}
          <div>
            <div className="text-2xl font-bold">
              <img
                src="/logo(150x50).png"
                alt="Logo"
                className="h-12"
              />
            </div>
            <p className="leading-relaxed">
              Chào mừng bạn đến với <strong>ToyStore</strong> – nơi bán các mẫu
              mô hình độc đáo, chất lượng cao. Chúng tôi cam kết mang đến cho
              bạn trải nghiệm mua sắm hoàn hảo cùng dịch vụ tận tâm nhất.
            </p>
            <p className="mt-4 leading-relaxed">
              <strong>Địa chỉ</strong>: 123 Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, TP.
              Cần Thơ
            </p>
            <div className="flex space-x-4 mt-4">
              {socialIcons.map(({ Icon, label, color }, index) => (
                <Icon
                  key={index}
                  className={`cursor-pointer ${color}`}
                  size={24}
                  aria-label={label}
                />
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 ">
                {supportLinks.map((link, index) => (
                  <li key={index} className="hover:text-hover-primary cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
              <ul className="space-y-2 ">
                {mainLinks.map((link, index) => (
                  <li key={index} className="hover:text-hover-primary cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 ">
                <li className="flex items-center space-x-2">
                  <Phone className="text-hover-primary" size={18} strokeWidth={1.5} />
                  <span>(+84) 942 463 758</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="text-hover-primary" size={18} strokeWidth={1.5} />
                  <span>support@mail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t mt-8 pt-6 text-sm text-center">
          <span>© 2025 ToyStore. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
