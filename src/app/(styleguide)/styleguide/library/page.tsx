import type { Metadata } from "next";
import { LibraryShowcase } from "./library-showcase";

export const metadata: Metadata = {
  title: "Visual Library — Styleguide",
  robots: { index: false, follow: false },
};

export default function LibraryStyleguidePage() {
  return <LibraryShowcase />;
}
