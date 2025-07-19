import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Chair from "./Chair";
import Settings from "./Settings";
import Invoice from "./Invoice";
import History from "./History"; // ✅ استدعاء الصفحة

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chair/:chairId" element={<Chair />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/history" element={<History />} /> {/* ✅ روت صفحة الهيستوري */}
      </Routes>
    </Router>
  );
}

export default App;
