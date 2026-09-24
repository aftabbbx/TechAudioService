import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { AdminGuard } from "@/components/admin/AdminGuard";
import "@/app/admin.css";

export const metadata = {
  title: "Admin | AudioTechServices",
  description: "AudioTechServices Admin Panel",
  robots: { index: false, follow: false },
};

/**
 * Admin layout — completely isolated from the main website layout.
 * No Header, Footer, or SmoothScroll from the main site.
 * Uses its own admin.css design system.
 */
export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminGuard>
        {children}
      </AdminGuard>
    </AdminAuthProvider>
  );
}
