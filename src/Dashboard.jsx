import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Settings, History, Plus, X, Check, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/logo.png";
import useStore from "./store";

const Dashboard = () => {
  const navigate = useNavigate();

  // Store states
  const orderCounts = useStore((state) => state.orderCounts);
  const incrementOrderCount = useStore((state) => state.incrementOrderCount);
  const decrementOrderCount = useStore((state) => state.decrementOrderCount);
  const resetSingleOrderCount = useStore(
    (state) => state.resetSingleOrderCount
  );
  const services = useStore((state) => state.services);
  const addService = useStore((state) => state.addService);
  const initializeData = useStore((state) => state.initializeData);

  // Local states
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

  // Animation variants
  const chairVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
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
          ? "bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 text-amber-800"
          : "bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-blue-800"
      }`}
    >
      {isVIP && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
          VIP
        </div>
      )}

      <div className="text-center">
        <h3
          className={`text-2xl font-bold mb-1 ${
            isVIP ? "text-amber-600" : "text-blue-600"
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
          className={`px-4 py-2 rounded-lg font-medium ${
            isVIP
              ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          } text-white shadow-md`}
        >
          بدء الطلب
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => decrementOrderCount(num)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg font-medium flex items-center gap-1"
        >
          <Minus size={16} /> ناقص
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => resetSingleOrderCount(num)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg font-medium"
        >
          تصفير
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header with Logo */}
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
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
          💈 مقص بلال
        </h1>
      </motion.div>

      {/* Chairs Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {[1, 2, 3, 4, 5].map((num) => renderChairCard(num))}
        {renderChairCard("vip", true)}
      </motion.div>

      {/* Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            إدارة الخدمات
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="اسم خدمة جديدة..."
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddService}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
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
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Settings size={18} />
              إعداد الأسعار
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenHistory}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <History size={18} />
              سجل الفواتير
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  🔒 التحقق من الهوية
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                لطفاً أدخل كلمة المرور للوصول إلى سجل الفواتير
              </p>

              <input
                type="password"
                placeholder="كلمة المرور"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckPassword}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  تأكيد
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-medium"
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
