import React from "react"; // <-- السطر ده مهم!
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Trash2, FileText, List } from "lucide-react";
import html2pdf from "html2pdf.js";

const History = () => {
  const [history, setHistory] = useState([]);
  const [filterBarber, setFilterBarber] = useState("الكل");
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
    invoiceElement.className = "p-4 bg-white";
    invoiceElement.innerHTML = `
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold">💈 مقص بلال</h2>
        <p class="text-sm">فاتورة #${invoiceData.invoiceNumber}</p>
      </div>
      <div class="mb-4">
        <p>الزبون: ${invoiceData.customer}</p>
        <p>الفني: ${invoiceData.barber || "—"}</p>
        <p>التاريخ: ${invoiceData.createdAt}</p>
      </div>
      <table class="w-full mb-4">
        <thead>
          <tr>
            <th class="text-left">الخدمة</th>
            <th class="text-right">السعر</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.services
            .map(
              (service) => `
                <tr>
                  <td>${service.name}</td>
                  <td class="text-right">${service.price} ج</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <div class="text-right font-bold">
        الإجمالي: ${invoiceData.total} جنيه
      </div>
      <div class="text-center mt-4 text-sm">
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

  const technicianFinancialStats = useMemo(() => {
    return history.reduce((acc, item) => {
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
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">📭 لا يوجد فواتير محفوظة</h2>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            الرجوع للرئيسية ↩️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6">🧾 سجل الفواتير</h2>

      <div className="flex justify-end mb-4">
        <select
          value={filterBarber}
          onChange={(e) => setFilterBarber(e.target.value)}
          className="select select-bordered max-w-xs"
        >
          {getBarbers().map((barber, index) => (
            <option key={index} value={barber}>
              {barber === "الكل" ? "عرض الكل" : `الفني: ${barber}`}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4 max-w-4xl mx-auto">
        <table className="table w-full text-center">
          <thead className="bg-base-200">
            <tr>
              <th>رقم</th>
              <th>الزبون</th>
              <th>الفني</th>
              <th>الإجمالي</th>
              <th>التاريخ</th>
              <th>الأوامر</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="hover">
                  <td>#{index + 1}</td>
                  <td>{item.customer}</td>
                  <td>{item.barber || "—"}</td>
                  <td>{item.total} ج</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => toggleInvoiceDetails(item.invoiceNumber)}
                        className="btn btn-xs btn-warning"
                        title="تفاصيل الطلب"
                      >
                        <List size={16} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/invoice/${item.invoiceNumber}`)
                        }
                        className="btn btn-xs btn-info"
                        title="عرض التفاصيل"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(item)}
                        className="btn btn-xs btn-primary"
                        title="إعادة طباعة"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(item.invoiceNumber)}
                        className="btn btn-xs btn-error"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedInvoice === item.invoiceNumber && (
                  <tr className="bg-gray-50">
                    <td colSpan="7">
                      <div className="p-4">
                        <h4 className="font-bold mb-2">الخدمات المقدمة:</h4>
                        <ul className="space-y-1">
                          {item.services.map((service, i) => (
                            <li key={i} className="flex justify-between">
                              <span>{service.name}</span>
                              <span>{service.price} ج</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t font-bold">
                          الإجمالي: {item.total} ج
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded-xl p-4 mt-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">
          💵 التقارير المالية
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>الفني</th>
                <th>عدد الفواتير</th>
                <th>إجمالي الإيرادات</th>
                <th>أفضل 3 خدمات</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(technicianFinancialStats).map(
                ([name, stats], i) => (
                  <tr key={i}>
                    <td>{name}</td>
                    <td>{stats.count}</td>
                    <td>{stats.total.toFixed(2)} ج</td>
                    <td>
                      {Object.entries(stats.services)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([service, total], j) => (
                          <div key={j}>
                            {service}: {total.toFixed(2)} ج
                          </div>
                        ))}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-4 mt-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">
          📊 إحصائيات الفنيين{" "}
          {filterBarber !== "الكل" && `(الفني: ${filterBarber})`}
        </h3>
        <ul className="list-disc pr-6 text-right">
          {Object.entries(technicianStats).map(([name, count], i) => (
            <li key={i}>
              {name}: {count} أوردر{count > 1 ? "ات" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate("/")}
          className="btn btn-outline btn-sm"
        >
          الرجوع ↩️
        </button>
        <button onClick={handleClearHistory} className="btn btn-error btn-sm">
          🗑️ مسح كل الفواتير
        </button>
      </div>
    </div>
  );
};

export default History;
