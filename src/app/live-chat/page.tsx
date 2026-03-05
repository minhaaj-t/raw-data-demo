import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { LiveChatInterface } from "./_components/LiveChatInterface";

export const metadata = {
  title: "Live Chat",
};

export default function LiveChatPage() {
  return (
    <>
      <Breadcrumb pageName="Live Chat" />

      <div className="flex h-[calc(100vh-12rem)] min-h-0 flex-col">
        <LiveChatInterface />
      </div>
    </>
  );
}
