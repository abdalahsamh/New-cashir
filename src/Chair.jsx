import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trash2, ArrowLeft, Check, Plus } from "lucide-react";
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
].map((name) => ({ name, price: 0 }));

const Chair = () => {
  const { chairId } = useParams();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [barberName, setBarberName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [isVIP, setIsVIP] = useState(chairId === "vip");

  const defaultNames = defaultServices.map((s) => s.name);

  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      setServices(defaultServices);
    }
  }, []);

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, name) => {
      const service = services.find((s) => s.name === name);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleFinish = () => {
    if (!customerName || !barberName || selectedServices.length === 0) {
      alert("من فضلك ادخل اسم الزبون واسم الفني واختر خدمة واحدة على الأقل");
      return;
    }

    const invoiceData = {
      customer: customerName,
      barber: barberName,
      chair: chairId,
      services: selectedServices.map((name) => {
        const service = services.find((s) => s.name === name);
        return { name, price: service?.price || 0 };
      }),
      total: calculateTotal(),
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem("lastInvoice", JSON.stringify(invoiceData));
    navigate("/invoice");
  };

  const handleDelete = (name) => {
    const confirmDelete = window.confirm(`هل تريد حذف "${name}"؟`);
    if (!confirmDelete) return;

    const updated = services.filter((s) => s.name !== name);
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));
    setSelectedServices((prev) => prev.filter((n) => n !== name));
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
            className={`text-3xl font-bold text-center mb-2 bg-clip-text text-transparent ${
              isVIP
                ? "bg-gradient-to-r from-amber-500 to-amber-700"
                : "bg-gradient-to-r from-blue-600 to-blue-800"
            }`}
          >
            {isVIP ? "⭐ كرسي VIP" : `🪑 كرسي ${chairId}`}
          </motion.h2>
          <p className="text-gray-600">تسجيل طلب جديد</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                اسم الزبون
              </label>
              <input
                type="text"
                placeholder="أدخل اسم الزبون"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                اسم الفني
              </label>
              <input
                type="text"
                placeholder="أدخل اسم الفني"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={barberName}
                onChange={(e) => setBarberName(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                💼 قائمة الخدمات
              </h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedServices.includes(service.name)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                    onClick={() => toggleService(service.name)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{service.name}</span>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          {service.price}ج
                        </span>

                        {selectedServices.includes(service.name) ? (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                    </div>

                    {!defaultNames.includes(service.name) && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(service.name);
                        }}
                        className="absolute top-2 left-2 p-1 text-red-500 hover:text-red-700 rounded-full"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                💵 إجمالي الفاتورة
              </h3>
              <div className="text-2xl font-bold text-green-600">
                {calculateTotal()} جنيه
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              onClick={handleFinish}
              disabled={
                !customerName || !barberName || selectedServices.length === 0
              }
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                !customerName || !barberName || selectedServices.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              }`}
            >
              <Check size={18} />
              إنهاء الطلب
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chair;
