import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const defaultServices = [
  "قص شعر",
  "تدريج دقن",
  "حلاقة دقن",
  "صبغة",
  "استشوار",
  "ويفي",
  "أفرو",
  "حمام مغربي",
  "تنظيف بشرة بالبخار",
  "تنظيف بشرة - ٧ مراحل",
  "باديكير رجالي",
  "VIP",
  "حمام كريم",
  "ماسك",
  "فرد بوتوكس",
  "بروتين معالج",
  "حمام زيت",
  "جلسة تنظيف قشرة",
  "مساج سوفت",
  "مساج هارد",
  "فوطة سخنة",
  "مكواة",
  "قص أطفال",
  "شمع (Wax)",
  "فتلة",
  "عريس VIP",
  "عريس بريميوم",
  "شاور",
];

const Settings = () => {
  const [services, setServices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("services");

    if (stored) {
      setServices(JSON.parse(stored));
    } else {
      const initialServices = defaultServices.map((name) => ({
        name,
        price: 0,
      }));
      setServices(initialServices);
    }
  }, []);

  const handlePriceChange = (index, newPrice) => {
    const updated = [...services];
    updated[index].price = parseFloat(newPrice) || 0;
    setServices(updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem("services", JSON.stringify(services));

    setTimeout(() => {
      setIsSaving(false);
      navigate("/");
    }, 1500);
  };

  const handleResetCounts = () => {
    setIsResetting(true);
    localStorage.removeItem("orderCounts");

    setTimeout(() => {
      setIsResetting(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <motion.h2
            whileHover={{ scale: 1.01 }}
            className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            ⚙️ إعدادات النظام
          </motion.h2>
          <p className="text-gray-600">تعديل أسعار الخدمات وإعدادات أخرى</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <h3 className="text-xl font-semibold text-blue-800">
              💰 أسعار الخدمات
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-right font-semibold text-gray-700">
                    الخدمة
                  </th>
                  <th className="text-center font-semibold text-gray-700">
                    السعر (جنيه)
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <motion.tr
                    key={service.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="py-3 font-medium text-gray-800">
                      {service.name}
                    </td>
                    <td className="py-3">
                      <div className="relative w-32 mx-auto">
                        <input
                          type="number"
                          min="0"
                          step="5"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center"
                          value={service.price}
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ج
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
            <h3 className="text-xl font-semibold text-amber-800">
              🔄 إعدادات أخرى
            </h3>
          </div>

          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">
                  تصفير عداد الطلبات
                </h4>
                <p className="text-sm text-gray-500">
                  إعادة تعيين عدد الطلبات لكل كرسي
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleResetCounts}
                disabled={isResetting}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isResetting
                    ? "bg-gray-200 text-gray-500"
                    : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                }`}
              >
                {isResetting ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                {isResetting ? "جاري التصفير..." : "تصفير العداد"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
          >
            <ArrowLeft size={18} />
            الرجوع للرئيسية
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              isSaving
                ? "bg-gray-300 text-gray-500"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={18} />
                حفظ التغييرات
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {(isSaving || isResetting) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 text-center max-w-sm"
            >
              <RefreshCw
                size={32}
                className="mx-auto mb-4 animate-spin text-blue-600"
              />
              <h3 className="text-xl font-bold mb-2">
                {isSaving ? "جاري حفظ التغييرات..." : "جاري تصفير العداد..."}
              </h3>
              <p className="text-gray-600">برجاء الانتظار...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Settings;
