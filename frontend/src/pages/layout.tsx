import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="container mx-auto h-screen">
      <Outlet />
    </div>
  );
}
