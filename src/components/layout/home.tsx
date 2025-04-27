import { ReactNode } from "react";

import { Grid, Layout as AntdLayout } from "antd";

import { Header } from "./header";

interface HomeProps {
  children: ReactNode;
}

export const Home: React.FC<HomeProps> = ({ children }) => {
  const breakpoint = Grid.useBreakpoint();

  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;
  return (
    <AntdLayout>
      <Header />
      <AntdLayout.Content
        style={{
          padding: isSmall ? 32 : 16,
        }}
      >
        {children}
      </AntdLayout.Content>
    </AntdLayout>
  );
};
