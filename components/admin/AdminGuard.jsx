"use client";

import { useAdminAuth } from "./AdminAuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Wrap admin pages with this component.
 * Redirects to /admin/login if not authenticated.
 */
export function AdminGuard({ children }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !admin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [admin, loading, pathname, router]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Authenticating…</p>
      </div>
    );
  }

  if (!admin && pathname !== "/admin/login") {
    return null;
  }

  return children;
}
