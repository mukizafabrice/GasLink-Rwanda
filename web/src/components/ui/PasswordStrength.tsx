import React from "react";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (
    pwd: string
  ): { score: number; label: string; color: string } => {
    let score = 0;
    if (!pwd) return { score: 0, label: "Empty", color: "bg-gray-200" };

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    const strengthMap = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
      { label: "Very Strong", color: "bg-green-600" },
    ];

    const index = Math.min(score, strengthMap.length - 1);
    return { score, ...strengthMap[index] };
  };

  const strength = calculateStrength(password);
  const width = `${(strength.score / 5) * 100}%`;

  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Password strength
        </span>
        <span
          className={`text-sm font-semibold ${strength.color.replace(
            "bg-",
            "text-"
          )}`}
        >
          {strength.label}
        </span>
      </div>

      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
        <div
          className={`h-full ${strength.color} transition-all duration-500 ease-out`}
          style={{ width }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                req.met ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span
              className={`text-xs ${
                req.met ? "text-green-600" : "text-gray-500"
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
