import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // ✅ أيقونة سلة من مكتبة lucide-react (تأكد إنها مثبتة)

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
    <div className="min-h-screen bg-base-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        🪑 تسجيل طلب - كرسي {chairId}
      </h2>

      <div className="max-w-2xl mx-auto space-y-6">
        <input
          type="text"
          placeholder="اسم الزبون"
          className="input input-bordered w-full"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          placeholder="اسم الفني"
          className="input input-bordered w-full"
          value={barberName}
          onChange={(e) => setBarberName(e.target.value)}
        />

        <div className="bg-base-200 rounded-xl p-4 max-h-[400px] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">💼 الخدمات:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => (
              <label
                key={service.name}
                className="flex items-center justify-between bg-white rounded-lg shadow px-3 py-2 cursor-pointer transition hover:bg-blue-50"
              >
                <div className="flex items-center gap-2">
                  <span>{service.name}</span>
                  {!defaultNames.includes(service.name) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(service.name);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-info">{service.price}ج</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => toggleService(service.name)}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="text-right text-xl font-bold">
          💵 الإجمالي:{" "}
          <span className="text-green-600">{calculateTotal()}</span> جنيه
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline w-1/2"
          >
            رجوع ↩️
          </button>
          <button onClick={handleFinish} className="btn btn-success w-1/2">
            إنهاء الطلب ✅
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chair;
