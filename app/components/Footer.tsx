import Link from 'next/link';
import Image from 'next/image';
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import { Typography, Row, Col, theme } from 'antd';
import SubscribeForm from './Home/SubscribeForm';
const { useToken } = theme;

const { Title, Text } = Typography;

const socialLinks = [
  {
    href: "https://www.instagram.com/apple_readymade/",
    label: "Instagram",
    icon: <InstagramOutlined />,
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: <FacebookOutlined />,
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    icon: <TwitterOutlined />,
  },
];

export default function Footer() {
  const { token } = useToken();
  return (
    <footer data-scroll className="p-6" style={{ backgroundColor: token.colorBgContainer, borderTop: `1px solid ${token.colorBorder}` }}>
      <Row gutter={[32, 32]} justify="center" className="max-w-7xl mx-auto">
        <Col xs={24} md={6}>
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src="/logo.png"
              alt="Apple Logo"
              width={36}
              height={36}
              priority
            />
            <Title level={4} className="m-0" style={{ color: token.colorText }}>
              Apple Readymade & More
            </Title>
          </div>
          <Text style={{ color: token.colorTextSecondary }} className="max-w-xs leading-relaxed">
            Where tradition meets trend — quality readymade wear with a fresh twist.
          </Text>
        </Col>

        {/* Shop Links */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="mb-3" style={{ color: token.colorTextHeading }}>Shop</Title>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/collections/new-arrivals", label: "New Arrivals" },
              { href: "/collections/shirts", label: "Shirts" },
              { href: "/collections/accessories", label: "Accessories" },
              { href: "/collections/sale", label: "Sale" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} style={{ color: token.colorTextSecondary }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Col>

        {/* Customer Service */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="mb-3" style={{ color: token.colorTextHeading }}>Customer Service</Title>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/contact", label: "Contact Us" },
              { href: "/shipping", label: "Shipping" },
              // { href: "/returns", label: "Returns" }, 
              { href: "/refund-cancellation", label: "Refund-cancellation policy" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} style={{ color: token.colorTextSecondary }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Col>

        {/* Social & Newsletter */}
        <Col xs={24} md={6}>
          <Title level={5} className="mb-3" style={{ color: token.colorTextHeading }}>Stay Connected</Title>
          <SubscribeForm />
          <div className="flex space-x-6 text-xl" style={{ color: token.colorTextSecondary }}>
            {socialLinks.map(social => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                style={{ color: 'inherit' }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </Col>
      </Row>

      {/* Bottom line */}
      <div className="mt-10 pt-6 pb-2 text-center text-sm" style={{ borderTop: `1px solid ${token.colorBorder}`, color: token.colorTextTertiary }}>
        Copyright &copy; {new Date().getFullYear()} Apple Menswear Co. All rights reserved.
      </div>
    </footer>
  );
}
