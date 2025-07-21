import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Printer,
  Trash2,
  FileText,
  List,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import { motion, AnimatePresence } from "framer-motion";

const History = () => {
  const [history, setHistory] = useState([]);
  const [filterBarber, setFilterBarber] = useState("الكل");
  const [filterFinancialBarber, setFilterFinancialBarber] = useState("الكل");
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem("invoiceHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const toggleInvoiceDetails = (invoiceNumber) => {
    setExpandedInvoice(
      expandedInvoice === invoiceNumber ? null : invoiceNumber
    );
  };

  const getBarbers = () => {
    const barbers = history.map((item) => item.barber || "—");
    return ["الكل", ...new Set(barbers)];
  };

  const filteredHistory = history
    .slice()
    .reverse()
    .filter(
      (item) =>
        filterBarber === "الكل" ||
        item.barber === filterBarber ||
        (filterBarber === "—" && !item.barber)
    );

  const handleClearHistory = () => {
    const confirmDelete = window.confirm("هل أنت متأكد من مسح كل الفواتير؟");
    if (confirmDelete) {
      localStorage.removeItem("invoiceHistory");
      setHistory([]);
      alert("✅ تم مسح كل الفواتير");
    }
  };

  const handleDeleteInvoice = (invoiceNumber) => {
    const confirmDelete = window.confirm(
      `هل تريد حذف الفاتورة ${invoiceNumber}؟`
    );
    if (confirmDelete) {
      const updatedHistory = history.filter(
        (inv) => inv.invoiceNumber !== invoiceNumber
      );
      localStorage.setItem("invoiceHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      alert("✅ تم الحذف بنجاح");
    }
  };

  const handlePrintInvoice = (invoiceData) => {
    const invoiceElement = document.createElement("div");
    invoiceElement.className = "p-8 bg-white font-sans";
    invoiceElement.innerHTML = `
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-blue-600">💈 مقص بلال</h2>
        <p class="text-gray-500">فاتورة #${invoiceData.invoiceNumber}</p>
      </div>
      <div class="mb-6 space-y-2">
        <p class="flex justify-between"><span class="font-medium">الزبون:</span> ${
          invoiceData.customer
        }</p>
        <p class="flex justify-between"><span class="font-medium">الفني:</span> ${
          invoiceData.barber || "—"
        }</p>
        <p class="flex justify-between"><span class="font-medium">التاريخ:</span> ${
          invoiceData.createdAt
        }</p>
      </div>
      <table class="w-full mb-6 border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="text-right p-3 border">الخدمة</th>
            <th class="text-left p-3 border">السعر</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.services
            .map(
              (service) => `
            <tr>
              <td class="text-right p-3 border">${service.name}</td>
              <td class="text-left p-3 border">${service.price} ج</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="text-left font-bold text-lg mt-4 pt-4 border-t">
        الإجمالي: ${invoiceData.total} جنيه
      </div>
      <div class="text-center mt-8 text-sm text-gray-500">
        شكرًا لزيارتكم ✂️
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `فاتورة_${invoiceData.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a5", orientation: "portrait" },
    };

    html2pdf().from(invoiceElement).set(opt).save();
  };

  const technicianStats = filteredHistory.reduce((acc, item) => {
    const name = item.barber?.trim() || "—";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const filteredFinancialStats = useMemo(() => {
    const stats = history.reduce((acc, item) => {
      const name = item.barber?.trim() || "—";
      if (!acc[name]) {
        acc[name] = {
          count: 0,
          total: 0,
          services: {},
        };
      }
      acc[name].count += 1;
      acc[name].total += item.total;

      item.services.forEach((service) => {
        acc[name].services[service.name] =
          (acc[name].services[service.name] || 0) + service.price;
      });

      return acc;
    }, {});

    if (filterFinancialBarber === "الكل") return stats;

    return {
      [filterFinancialBarber]: stats[filterFinancialBarber] || {
        count: 0,
        total: 0,
        services: {},
      },
    };
  }, [history, filterFinancialBarber]);

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <motion.h2
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-2xl font-bold mb-4 text-gray-800"
          >
            📭 لا يوجد فواتير محفوظة
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            الرجوع للرئيسية ↩️
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2
          whileHover={{ scale: 1.01 }}
          className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent"
        >
          🧾 سجل الفواتير
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition"
          >
            <Home size={18} />
            الرئيسية
          </motion.button>

          <motion.select
            whileHover={{ scale: 1.02 }}
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            className="select select-bordered bg-white shadow-sm max-w-xs"
          >
            {getBarbers().map((barber, index) => (
              <option key={index} value={barber}>
                {barber === "الكل" ? "عرض الكل" : `الفني: ${barber}`}
              </option>
            ))}
          </motion.select>
        </div>

        <motion.div
          layout
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="text-center">رقم</th>
                  <th className="text-center">الزبون</th>
                  <th className="text-center">الفني</th>
                  <th className="text-center">الإجمالي</th>
                  <th className="text-center">التاريخ</th>
                  <th className="text-center">الأوامر</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="text-center font-medium">#{index + 1}</td>
                    <td className="text-center">{item.customer}</td>
                    <td className="text-center">{item.barber || "—"}</td>
                    <td className="text-center font-bold">{item.total} ج</td>
                    <td className="text-center">{item.createdAt}</td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            toggleInvoiceDetails(item.invoiceNumber)
                          }
                          className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
                          title="تفاصيل الطلب"
                        >
                          {expandedInvoice === item.invoiceNumber ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePrintInvoice(item)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                          title="إعادة طباعة"
                        >
                          <Printer size={16} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleDeleteInvoice(item.invoiceNumber)
                          }
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <AnimatePresence>
            {expandedInvoice && (
              <motion.tr
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50"
              >
                <td colSpan="6">
                  <div className="p-4">
                    <h4 className="font-bold mb-3 text-gray-700">
                      الخدمات المقدمة:
                    </h4>
                    <ul className="space-y-2">
                      {history
                        .find((inv) => inv.invoiceNumber === expandedInvoice)
                        ?.services.map((service, i) => (
                          <motion.li
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex justify-between bg-white p-3 rounded-lg shadow-sm"
                          >
                            <span className="font-medium">{service.name}</span>
                            <span className="text-blue-600 font-bold">
                              {service.price} ج
                            </span>
                          </motion.li>
                        ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t font-bold text-lg text-blue-700">
                      الإجمالي:{" "}
                      {
                        history.find(
                          (inv) => inv.invoiceNumber === expandedInvoice
                        )?.total
                      }{" "}
                      ج
                    </div>
                  </div>
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800">
              💵 التقارير المالية
            </h3>
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={filterFinancialBarber}
              onChange={(e) => setFilterFinancialBarber(e.target.value)}
              className="select select-bordered bg-white shadow-sm max-w-xs"
            >
              {getBarbers().map((barber, index) => (
                <option key={index} value={barber}>
                  {barber === "الكل" ? "عرض الكل" : `الفني: ${barber}`}
                </option>
              ))}
            </motion.select>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-right">الفني</th>
                  <th className="text-right">عدد الفواتير</th>
                  <th className="text-right">إجمالي الإيرادات</th>
                  <th className="text-right">أفضل 3 خدمات</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(filteredFinancialStats).map(
                  ([name, stats], i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="font-medium">{name}</td>
                      <td>{stats.count}</td>
                      <td className="font-bold text-green-600">
                        {stats.total.toFixed(2)} ج
                      </td>
                      <td>
                        {Object.entries(stats.services)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3)
                          .map(([service, total], j) => (
                            <div
                              key={j}
                              className="flex justify-between items-center py-1"
                            >
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {service}
                              </span>
                              <span className="font-medium">
                                {total.toFixed(2)} ج
                              </span>
                            </div>
                          ))}
                      </td>
                    </motion.tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            📊 إحصائيات الفنيين{" "}
            {filterBarber !== "الكل" && `(الفني: ${filterBarber})`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(technicianStats).map(([name, count], i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {count} أوردر{count > 1 ? "ات" : ""}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearHistory}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            🗑️ مسح كل الفواتير
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default History;
