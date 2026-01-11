import AuthScreen from "@/components/Auth/AuthScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Screen",
};

export default function AuthScreenPage() {
  return <AuthScreen />;
}