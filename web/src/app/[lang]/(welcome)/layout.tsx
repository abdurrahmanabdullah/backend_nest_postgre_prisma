// src/app/[lang]/(welcome)/layout.tsx
import { ReactNode } from "react";
import SpecialLayout from "./component/SpecialLayout";

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return <SpecialLayout>{children}</SpecialLayout>;
}
