import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Settings, History, Plus, X, Check, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/logo.png";
import useStore from "./store";

const Dashboard = () => {
  const navigate = useNavigate();

  const orderCounts = useStore((state) => state.orderCounts);
  const incrementOrderCount = useStore((state) => state.incrementOrderCount);
  const decrementOrderCount = useStore((state) => state.decrementOrderCount);
  const resetSingleOrderCount = useStore(
    (state) => state.resetSingleOrderCount
  );
  const services = useStore((state) => state.services);
  const addService = useStore((state) => state.addService);
  const initializeData = useStore((state) => state.initializeData);

  const [newService, setNewService] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    initializeData();
  }, []);

  const handleChairClick = (chairNumber) => {
    incrementOrderCount(chairNumber);
    navigate(`/chair/${chairNumber}`);
  };

  const handleAddService = () => {
    const trimmed = newService.trim();
    if (!trimmed) return alert("اكتب اسم الخدمة أولاً");
    if (services.find((s) => s.name === trimmed))
      return alert("الخدمة موجودة بالفعل");
    addService(trimmed);
    setNewService("");
  };

  const handleOpenHistory = () => setShowPasswordModal(true);

  const handleCheckPassword = () => {
    if (passwordInput === "Admin.123") {
      setShowPasswordModal(false);
      setPasswordInput("");
      navigate("/history");
    } else {
      alert("❌ كلمة السر غير صحيحة");
    }
  };

  const chairVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" },
  };

  const renderChairCard = (num, isVIP = false) => (
    <motion.div
      key={num}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={chairVariants}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${
        isVIP
          ? "bg-yellow-900 border-2 border-yellow-700 text-yellow-200"
          : "bg-gray-800 border border-gray-700 text-white"
      }`}
    >
      {isVIP && (
        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
          VIP
        </div>
      )}

      <div className="text-center">
        <h3
          className={`text-2xl font-bold mb-1 ${
            isVIP ? "text-yellow-400" : "text-blue-400"
          }`}
        >
          {isVIP ? "⭐ كرسي VIP" : `كرسي ${num}`}
        </h3>
        <p className="text-sm mb-4">
          عدد الطلبات:{" "}
          <span className="font-bold">{orderCounts[num] || 0}</span>
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChairClick(num)}
          className={`px-4 py-2 rounded-lg font-medium shadow-md ${
            isVIP
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          بدء الطلب
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => decrementOrderCount(num)}
          className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg font-medium flex items-center gap-1"
        >
          <Minus size={16} /> ناقص
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => resetSingleOrderCount(num)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium"
        >
          تصفير
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <img
          src={logo}
          alt="Logo"
          className="h-28 w-auto object-contain mb-4 drop-shadow-lg"
        />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">
          💈 مقص بلال
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {[1, 2, 3, 4, 5].map((num) => renderChairCard(num))}
        {renderChairCard("vip", true)}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 max-w-2xl mx-auto"
      >
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-center mb-6 text-white">
            إدارة الخدمات
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="اسم خدمة جديدة..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddService}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              إضافة خدمة
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/settings")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Settings size={18} />
              إعداد الأسعار
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenHistory}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <History size={18} />
              سجل الفواتير
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">🔒 التحقق من الهوية</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 mb-4">
                لطفاً أدخل كلمة المرور للوصول إلى سجل الفواتير
              </p>

              <input
                type="password"
                placeholder="كلمة المرور"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg mb-4 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckPassword}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  تأكيد
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg font-medium"
                >
                  إلغاء
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
