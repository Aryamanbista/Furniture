import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  Monitor,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your preferences and account settings.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Appearance
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Choose how FurniHome looks to you.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        theme === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Notifications
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  key: "orderUpdates",
                  label: "Order Updates",
                  desc: "Get notified about your order status",
                },
                {
                  key: "promotions",
                  label: "Promotions",
                  desc: "Receive deals and offers",
                },
                {
                  key: "newsletter",
                  label: "Newsletter",
                  desc: "Weekly design inspiration",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications[item.key]
                        ? "bg-primary"
                        : "bg-secondary border border-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform shadow-sm ${
                        notifications[item.key]
                          ? "translate-x-5.5 bg-white"
                          : "translate-x-0.5 bg-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> Security
              </h2>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="p-6 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={
                    !passwords.current ||
                    !passwords.newPassword ||
                    passwords.newPassword !== passwords.confirm
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" /> Update Password
                </motion.button>
              </div>
            )}

            {!showPasswordForm && (
              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  Password last changed:{" "}
                  <span className="text-foreground font-medium">Never</span>
                </p>
              </div>
            )}
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-destructive/20 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-destructive/20 bg-destructive/5">
              <h2 className="font-semibold text-destructive">Danger Zone</h2>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data.
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-xl hover:bg-destructive/10 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
