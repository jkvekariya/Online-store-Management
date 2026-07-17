import { Outlet } from "react-router-dom";

const AdminAuthLayout = () => {
  return (
    <div>
      <h2>Admin Auth Section</h2>
      <Outlet />
    </div>
  );
};

export default AdminAuthLayout;
