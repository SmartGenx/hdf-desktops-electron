import { useState, useEffect, useRef } from "react";
import { getApi } from "./http";
import { useAuthHeader } from "react-auth-kit";

export interface Applicant {
  id: string | number;
  name: string;
  phoneNumber: string;
}

/**
 * Hook يُوفّر:
 *   • applicants        القائمة الكاملة بعد الجلب
 *   • search            نص البحث
 *   • setSearch         لتحديث نص البحث
 *   • filtered          المتقدّمون المطابقون
 *   • show              Boolean لإظهار الدروب-داون
 *   • setShow           لتغيير حالة الإظهار
 *   • wrapperRef        مرجع لإغلاق القائمة عند النقر خارجها
 *   • selectApplicant   دالة تعيين الاسم والرقم عند الاختيار
 */
export function useApplicants() {
  const authToken = useAuthHeader();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* جلب المتقدّمين مرة واحدة */
  useEffect(() => {
    (async () => {
      try {
        const res = await getApi<Applicant[]>("/applicant", {
          headers: { Authorization: authToken() },
        });
        setApplicants(res.data);
      } catch (e) {
        console.error("Error fetching applicants:", e);
      }
    })();
  }, [authToken]);

  /* إغلاق القائمة عند النقر خارجها */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* تصفية المتقدّمين */
  const filtered = applicants.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  /* اختيار متقدّم */
  const selectApplicant = (a: Applicant, setPhone: (p: string) => void) => {
    setSearch(a.name);
    setPhone(a.phoneNumber);
    setShow(false);
  };

  return {
    applicants,
    search,
    setSearch,
    filtered,
    show,
    setShow,
    wrapperRef,
    selectApplicant,
  };
}
