import React from "react";
import toast from "react-hot-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/platform.service";
import type { User } from "@/types";

const UsersManagementPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    const response = await adminService.getUsers(search ? { search } : undefined);
    if (response.success && response.data) {
      setUsers(response.data);
    }
    setLoading(false);
  }, [search]);

  React.useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const toggleStatus = async (user: User) => {
    const response = await adminService.toggleUserStatus(user.id, !user.isActive);
    if (response.success) {
      toast.success(`${user.email} updated`);
      void loadUsers();
    }
  };

  return (
    <AdminLayout pageTitle="Users" breadcrumbs={[{ label: "Users" }]}>
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search users" />
      </div>
      {loading ? (
        <LoadingSpinner label="Loading users..." />
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => void toggleStatus(user)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersManagementPage;
