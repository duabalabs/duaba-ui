import React from 'react';

import { RefineThemedLayoutV2HeaderProps } from '@refinedev/antd';

import { Button, Layout, Space, theme } from 'antd';

import { useConfigProvider } from '@/providers/config-provider';

import { IconMoon, IconSun } from '../../icons';
import { CurrentUser } from '../current-user';
import { useStyles } from './styled';

const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const { mode, setMode } = useConfigProvider();
  const { token } = useToken();
  const { styles } = useStyles();
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: 'flex',
    alignItems: 'center',
    padding: '0px 24px',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 999,
  };
  const colorModeFromLocalStorage =
    localStorage.getItem('colorMode') ?? 'light';

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <Button
          className={styles.themeSwitch}
          type="text"
          icon={
            colorModeFromLocalStorage === 'light' ? <IconMoon /> : <IconSun />
          }
          onClick={() => {
            setMode?.(colorModeFromLocalStorage === 'light' ? 'dark' : 'light');
          }}
        />
        {/* <Notifications /> */}
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};
