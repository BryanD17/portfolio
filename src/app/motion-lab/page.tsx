import type { Metadata } from "next";
import { MotionLab } from "./MotionLab";

export const metadata: Metadata = {
  title: "Motion Lab",
  robots: { index: false, follow: false },
};

export default function MotionLabPage() {
  return <MotionLab />;
}
