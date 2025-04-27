import type { IResourceItem } from "@refinedev/core";

import {
  ContainerOutlined,
  CrownOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <DashboardOutlined />,
    },
  },
  // {
  //   name: "assets",
  //   list: "/assets",
  //   create: "/assets/create",
  //   edit: "/assets/edit/:id",
  //   show: "/assets/show/:id",
  //   meta: {
  //     label: "Assets",
  //     // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
  //     icon: <ContainerOutlined />,
  //   },
  // },

  // {
  //   name: "scanner",
  //   meta: {
  //     label: "Scanner",
  //     // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
  //     icon: <ContainerOutlined />,
  //   },
  // },

  // {
  //   name: "stock-scanner",
  //   list: "/scanner/stock-scanner",
  //   meta: {
  //     label: "Stock Scanner",
  //     parent: "scanner",
  //   },
  // },
  // {
  //   name: "forex-scanner",
  //   list: "/scanner/forex-scanner",
  //   meta: {
  //     label: "Forex Scanner",
  //     parent: "scanner",
  //   },
  // },

  {
    name: "administration",
    meta: {
      label: "Administration",
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      icon: <CrownOutlined />,
    },
  },
  {
    name: "settings",
    list: "/administration/settings",
    meta: {
      label: "Settings",
      parent: "administration",
    },
  },
];
