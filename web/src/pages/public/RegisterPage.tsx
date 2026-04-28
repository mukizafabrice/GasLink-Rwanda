import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    role: "CLIENT",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    businessPhone: "",
    businessEmail: "",
    businessLicense: "",
    description: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    streetAddress: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const response = await authService.register({
      ...formData,
      role: formData.role as any,
    });

    setLoading(false);

    if (!response.success || !response.data) {
      toast.error(response.message || "Registration failed");
      return;
    }

    authService.setAuthData(response.data.token, response.data.user);
    login(response.data.user);
    toast.success("Account created successfully");
    navigate(response.data.user.role === "MERCHANT" ? "/merchant/dashboard" : "/client/browse");
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="w-full max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center mb-8 text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mb-8 text-gray-600">Join GasLink Rwanda today</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => updateField("role", "CLIENT")}
                className={`p-4 border rounded-2xl text-left ${
                  formData.role === "CLIENT" ? "border-orange-500 bg-orange-50" : "border-gray-200"
                }`}
              >
                <div className="font-semibold text-gray-900">Client</div>
                <div className="mt-1 text-sm text-gray-500">
                  Browse merchants and place LPG orders.
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateField("role", "MERCHANT")}
                className={`p-4 border rounded-2xl text-left ${
                  formData.role === "MERCHANT" ? "border-orange-500 bg-orange-50" : "border-gray-200"
                }`}
              >
                <div className="font-semibold text-gray-900">Merchant</div>
                <div className="mt-1 text-sm text-gray-500">
                  Manage stock, orders, and delivery settings.
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="First name" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Last name" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required />
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
              <input className="px-4 py-3 border border-gray-200 rounded-xl md:col-span-2" placeholder="Password" type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} required />
            </div>

            {formData.role === "MERCHANT" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input className="px-4 py-3 border border-gray-200 rounded-xl md:col-span-2" placeholder="Business name" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} required />
                <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Business phone" value={formData.businessPhone} onChange={(e) => updateField("businessPhone", e.target.value)} required />
                <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Business email" value={formData.businessEmail} onChange={(e) => updateField("businessEmail", e.target.value)} />
                <input className="px-4 py-3 border border-gray-200 rounded-xl md:col-span-2" placeholder="Business license" value={formData.businessLicense} onChange={(e) => updateField("businessLicense", e.target.value)} />
                <textarea className="px-4 py-3 border border-gray-200 rounded-xl md:col-span-2" rows={3} placeholder="Business description" value={formData.description} onChange={(e) => updateField("description", e.target.value)} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Province" value={formData.province} onChange={(e) => updateField("province", e.target.value)} required={formData.role === "MERCHANT"} />
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="District" value={formData.district} onChange={(e) => updateField("district", e.target.value)} required={formData.role === "MERCHANT"} />
              <input className="px-4 py-3 border border-gray-200 rounded-xl" placeholder="Sector" value={formData.sector} onChange={(e) => updateField("sector", e.target.value)} required={formData.role === "MERCHANT"} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6">
            <Link
              to="/login"
              className="block text-center text-orange-600 hover:text-orange-700"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
