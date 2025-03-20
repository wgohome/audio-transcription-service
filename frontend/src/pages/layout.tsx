import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <div className="container mx-auto h-screen px-3">
      <Outlet />
      <Toaster richColors />
    </div>
  );
}
