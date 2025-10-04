import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from "antd";

export default function AntdRegister({ children } : { children: React.ReactNode}) {
  return (
    <AntdRegistry >
        <ConfigProvider
          theme={{
            algorithm: theme.compactAlgorithm,
            token: {
              colorPrimary: '#3A6F43',
              colorLink: '#000',
              colorLinkHover: '#000',
              colorLinkActive: 'green'
            },
          }}
        >
          {children}
        </ConfigProvider>
    </AntdRegistry>
  );
}
