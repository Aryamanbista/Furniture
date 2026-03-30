import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Camera, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updateProfile(formData);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-lg">
              {initial}
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-background border-2 border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">{user?.email}</p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium text-center"
          >
            ✓ Profile updated successfully!
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user?.name || "", email: user?.email || "" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-secondary rounded-xl mt-1">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{user?.name}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-secondary rounded-xl mt-1">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                ) : (
                  <p className="mt-1 text-foreground font-medium">{user?.email}</p>
                )}
              </div>
            </div>

            {/* Role (Read-only) */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-secondary rounded-xl mt-1">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </label>
                <p className="mt-1 text-foreground font-medium capitalize">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>

            {/* Member Since (Read-only) */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-secondary rounded-xl mt-1">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Member Since
                </label>
                <p className="mt-1 text-foreground font-medium">
                  {user?.memberSince || new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="px-6 py-4 border-t border-border bg-secondary/10">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
