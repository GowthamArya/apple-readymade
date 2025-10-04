import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Button, Form, Input, message, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

const footerLinkClass = "text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out";

export default function Footer() {
  return (
    <footer data-scroll className="bg-green-50/75 text-white p-6">
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
            <Title level={4} className="text-white m-0">
              Apple Readymade & More
            </Title>
          </div>
          <Text type="secondary" className="max-w-xs leading-relaxed">
            Where tradition meets trend — quality readymade wear with a fresh twist.
          </Text>
        </Col>

        {/* Shop Links */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="text-white mb-3">Shop</Title>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/collections/new-arrivals", label: "New Arrivals" },
              { href: "/collections/shirts", label: "Shirts" },
              { href: "/collections/accessories", label: "Accessories" },
              { href: "/collections/sale", label: "Sale" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={footerLinkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Col>

        {/* Customer Service */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="text-white mb-3">Customer Service</Title>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/support/contact", label: "Contact Us" },
              { href: "/support/shipping", label: "Shipping" },
              { href: "/support/returns", label: "Returns" },
              { href: "/support/faq", label: "FAQ" },
              { href: "/support/size-guide", label: "Size Guide" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={footerLinkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Col>

        {/* Social & Newsletter */}
        <Col xs={24} md={6}>
          <Title level={5} className="text-white mb-3">Stay Connected</Title>
          <Form
            layout="vertical"
            className="mb-4"
            onFinish={(values) => { 
              console.log('Subscribed with email:', values.email); 
              message.success('Thank you for subscribing!');
            }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
              className="mb-2"
            >
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-white text-sm"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
              >
                Subscribe
              </Button>
            </Form.Item>
          </Form>

          <div className="flex space-x-6 text-gray-400 text-xl">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaXTwitter /></a>
          </div>
        </Col>
      </Row>

      {/* Bottom line */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        Copyright &copy;  2025 Apple Menswear Co. All rights reserved.
      </div>
    </footer>
  );
}
