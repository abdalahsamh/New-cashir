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
              {/* أيقونة واتساب */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="ml-1 text-green-500"
              >
                <path d="M20.52 3.48a12.07 12.07 0 00-17.04 0A12.08 12.08 0 003.68 20L2 24l4.12-1.6a12.11 12.11 0 0014.4-18.92zM12 21.3a9.32 9.32 0 01-4.7-1.27l-.34-.2-2.45.94.94-2.39-.22-.36A9.3 9.3 0 1112 21.3zm5.1-6.93c-.28-.14-1.67-.82-1.93-.91s-.45-.14-.64.14-.73.91-.9 1.1-.34.21-.63.07a7.65 7.65 0 01-2.25-1.39 8.42 8.42 0 01-1.56-1.93c-.16-.28 0-.44.12-.6.12-.13.27-.34.4-.51a2 2 0 00.27-.46.54.54 0 00-.02-.51c-.07-.14-.64-1.55-.88-2.12s-.47-.46-.64-.47h-.55a1 1 0 00-.72.34 3 3 0 00-.93 2.2 5.26 5.26 0 001.1 2.58 11.42 11.42 0 004.33 4.18 7.83 7.83 0 002.33.86 2.28 2.28 0 001.49-.93 1.88 1.88 0 00.14-.93c-.06-.1-.23-.16-.51-.3z" />
              </svg>
              <a
                href="tel:01201353503"
                className="hover:text-green-500 print:hover:text-black"
              >
                01201353503
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
