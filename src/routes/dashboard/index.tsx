import React, { useState } from "react";

import { Tabs } from "antd";

const { TabPane } = Tabs;
export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("signal");
  return <div className="page-container"></div>;
};

export default DashboardPage;
