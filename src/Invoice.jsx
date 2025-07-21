import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react"; // تم استيراد أيقونة الهاتف

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("lastInvoice");
    if (stored) {
      const parsed = JSON.parse(stored);

      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const finalInvoice = {
        ...parsed,
        invoiceNumber: `INV-${randomNum}`,
        createdAt: new Date().toLocaleString(),
      };

      setInvoice(finalInvoice);
      setInvoiceNumber(finalInvoice.invoiceNumber);
    } else {
      alert("لا توجد فاتورة");
      navigate("/");
    }
  }, []);

  if (!invoice) return null;

  const total = invoice.total;
  const discountedTotal =
    discount > 0 ? total - (total * discount) / 100 : total;

  const handlePrintAndSave = () => {
    const invoiceWithDiscount = {
      ...invoice,
      invoiceNumber,
      createdAt: new Date().toLocaleString(),
      discount: discount,
      discountedTotal,
    };

    window.print();

    const history = JSON.parse(localStorage.getItem("invoiceHistory")) || [];
    history.push(invoiceWithDiscount);
    localStorage.setItem("invoiceHistory", JSON.stringify(history));

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black flex items-center justify-center print:bg-white">
      <div
        id="printable"
        className="w-[80mm] bg-white text-xs font-mono p-2 border border-gray-400 rounded shadow"
      >
        <h2 className="text-center font-bold text-base mb-2 border-b border-dashed pb-2">
          💈 مقص بلال
        </h2>

        <p>رقم الفاتورة: {invoiceNumber}</p>
        <p>التاريخ: {invoice.createdAt}</p>
        <p>الكرسي: {invoice.chair}</p>
        <p>الزبون: {invoice.customer}</p>
        <p>الفني: {invoice.barber || "—"}</p>

        <div className="my-2 border-t border-dashed" />

        <h3 className="font-bold mb-1">الخدمات:</h3>
        <ul className="mb-2 divide-y divide-dashed divide-gray-300">
          {invoice.services.map((item, i) => (
            <li key={i} className="flex justify-between py-1">
              <span>{item.name}</span>
              <span>{item.price} ج</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-dashed my-2" />

        <p className="text-right">الإجمالي قبل الخصم: {total} جنيه</p>
        {discount > 0 && (
          <>
            <p className="text-right">الخصم: {discount}%</p>
            <p className="text-right font-bold">
              بعد الخصم: {discountedTotal.toFixed(2)} جنيه
            </p>
          </>
        )}
        {discount === 0 && (
          <p className="text-right font-bold">الإجمالي: {total} جنيه</p>
        )}

        {/* قسم أرقام التليفونات مع الأيقونات */}
        <div className="mt-4 pt-2 border-t border-dashed text-center text-[10px]">
          <p className="font-bold mb-2 flex items-center justify-center">
            <Phone className="ml-1" size={14} />
            للحجز والاستعلام:
          </p>
          <div className="space-y-1">
            <p className="flex items-center justify-center">
              <Phone className="ml-1" size={12} />
              <a
                href="tel:01289139006"
                className="hover:text-blue-600 print:hover:text-black"
              >
                01289139006
              </a>
            </p>
            <p className="flex items-center justify-center">
              <Phone className="ml-1" size={12} />
              <a
                href="tel:01115291833"
                className="hover:text-blue-600 print:hover:text-black"
              >
                01115291833
              </a>
            </p>
          </div>
        </div>

        <p className="text-center mt-2 text-[10px]">
          شكرًا لزيارتكم ✂️ مقص بلال
        </p>
      </div>

      {/* التحكم في الخصم والطباعة */}
      <div className="flex flex-col items-center gap-4 mt-6 print:hidden">
        <div className="flex items-center gap-2">
          <label htmlFor="discount" className="text-sm font-bold">
            نسبة الخصم:
          </label>
          <select
            id="discount"
            className="select select-sm select-bordered"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          >
            <option value={0}>بدون خصم</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
            <option value={40}>40%</option>
            <option value={50}>50%</option>
          </select>
        </div>

        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline btn-sm w-full"
          >
            رجوع ↩️
          </button>
          <button
            onClick={handlePrintAndSave}
            className="btn btn-primary btn-sm w-full"
          >
            طباعة 🖨️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
