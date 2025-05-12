"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "../../../ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../ui/alert";
import { getApi, postApi } from "../../../../lib/http";

export function WhatsAppQRCode() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getApi<{ qrCode?: string }>("/wahtsApp/qrcode");
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      } else {
        throw new Error("لم يتم العثور على رمز QR في الاستجابة");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب رمز QR");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQRCode();
    const intervalId = setInterval(fetchQRCode, 120000);
    return () => clearInterval(intervalId);
  }, [fetchQRCode]);

  const handleResetQRCode = async () => {
    try {
      setLoading(true);
      setError(null);
      await postApi<{ message?: string }>("/wahtsApp/reset-qr", {});
      await fetchQRCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إعادة ضبط رمز QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {loading && (
        <>
          <Skeleton className="w-64 h-64 rounded-md" />
          <p className="mt-4 text-sm text-muted-foreground">جارٍ تحميل رمز الاستجابة السريعة...</p>
        </>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && qrCode && (
        <div className="border border-gray-200 rounded-md p-4 bg-white mt-4">
          <img  src={qrCode} alt="رمز QR لواتساب" width={256} height={256}  />
        </div>
      )}

      {!loading && !qrCode && !error && (
        <p className="text-red-500 mt-4">لا يوجد رمز QR متاح</p>
      )}

      <button
        onClick={handleResetQRCode}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        إعادة ضبط رمز QR
      </button>
    </div>
  );
}
