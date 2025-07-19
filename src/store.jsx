import { create } from "zustand";

const useStore = create((set) => ({
  services: [],
  orderCounts: {},

  // تحميل البيانات من localStorage عند البداية
  initializeData: () => {
    const storedServices = localStorage.getItem("services");
    const storedCounts = localStorage.getItem("orderCounts");

    set({
      services: storedServices ? JSON.parse(storedServices) : [],
      orderCounts: storedCounts ? JSON.parse(storedCounts) : {},
    });
  },

  // تحديث الخدمات كلها
  setServices: (newServices) => {
    localStorage.setItem("services", JSON.stringify(newServices));
    set({ services: newServices });
  },

  // زيادة عداد الطلبات لكرسي معين
  incrementOrderCount: (chair) =>
    set((state) => {
      const updatedCounts = {
        ...state.orderCounts,
        [chair]: (state.orderCounts[chair] || 0) + 1,
      };
      localStorage.setItem("orderCounts", JSON.stringify(updatedCounts));
      return { orderCounts: updatedCounts };
    }),

  // تقليل عداد الطلبات لكرسي معين (بس من غير ما يوصل لـ 0)
  decrementOrderCount: (chair) =>
    set((state) => {
      const current = state.orderCounts[chair] || 0;
      const updated = {
        ...state.orderCounts,
        [chair]: Math.max(current - 1, 0),
      };
      localStorage.setItem("orderCounts", JSON.stringify(updated));
      return { orderCounts: updated };
    }),

  // تصفير عداد كل الكراسي
  resetOrderCounts: () => {
    localStorage.removeItem("orderCounts");
    set({ orderCounts: {} });
  },

  // تصفير عداد كرسي واحد فقط
  resetSingleOrderCount: (chair) =>
    set((state) => {
      const updated = { ...state.orderCounts, [chair]: 0 };
      localStorage.setItem("orderCounts", JSON.stringify(updated));
      return { orderCounts: updated };
    }),

  // إضافة خدمة جديدة
  addService: (name) =>
    set((state) => {
      const exists = state.services.some((s) => s.name === name);
      if (exists) return state;

      const updated = [...state.services, { name, price: 0 }];
      localStorage.setItem("services", JSON.stringify(updated));
      return { services: updated };
    }),
}));

export default useStore;
