import { useState } from "react";
import Layout from "./components/Layout";
import DevicesPage from "./pages/DevicesPage";
import MessagesPage from "./pages/MessagesPage";

function App() {
  const [activeTab, setActiveTab] = useState("devices");

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "devices" && <DevicesPage />}
      {activeTab === "messages" && <MessagesPage />}
    </Layout>
  );
}

export default App;
