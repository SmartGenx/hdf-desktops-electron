import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { WhatsAppQRCode } from "./whatsApp-wrapper/whatsApp-wrapper";
import { Send } from "lucide-react";
import { postApi } from "../../../lib/http";
import { useAuthHeader } from "react-auth-kit";
import { useApplicants } from "../../../lib/useApplicants";

export default function WhatsAppIndex() {
  const { search, setSearch, filtered, show, setShow, wrapperRef, selectApplicant } =
    useApplicants();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const authToken = useAuthHeader();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !message) {
      setSendResult({ success: false, message: "رقم الهاتف والرسالة مطلوبة" });
      return;
    }
    setIsSending(true);
    setSendResult(null);
    try {
      const res = await postApi<{ messageId?: string; message?: string }>(
        "/wahtsApp/send-message",
        { phone, message },
        { headers: { Authorization: authToken() } }
      );
      if (res.data.messageId) {
        setSendResult({ success: true, message: res.data.message || "تم إرسال الرسالة بنجاح!" });
        setPhone("");
        setMessage("");
        setSearch("");
      } else {
        setSendResult({ success: false, message: res.data.message || "فشل في إرسال الرسالة" });
      }
    } catch {
      setSendResult({ success: false, message: "حدث خطأ أثناء إرسال الرسالة" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">تكامل واتساب</h1>
      <Tabs defaultValue="send" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">إرسال رسالة</TabsTrigger>
          <TabsTrigger value="qrcode">رمز الاستجابة</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>إرسال رسالة واتساب</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2 relative" ref={wrapperRef}>
                  <Label htmlFor="applicant">اسم المتقدم</Label>
                  <Input
                    id="applicant"
                    placeholder="ابحث عن المتقدم..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShow(true);
                    }}
                    onFocus={() => setShow(true)}
                  />
                  {show && filtered.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto">
                      {filtered.map((a) => (
                        <div
                          key={a.id}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => selectApplicant(a, setPhone)}
                        >
                          {a.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    placeholder="أدخل رقم الهاتف مع رمز الدولة"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {sendResult && (
                  <div
                    className={`p-3 rounded-md ${
                      sendResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sendResult.message}
                  </div>
                )}

                <Button type="submit" disabled={isSending} className="w-full">
                  {isSending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qrcode">
          <Card>
            <CardHeader>
              <CardTitle>امسح رمز الاستجابة</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="mb-4 text-center text-muted-foreground">
                امسح هذا الرمز باستخدام واتساب للاتصال
              </p>
              <WhatsAppQRCode />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
