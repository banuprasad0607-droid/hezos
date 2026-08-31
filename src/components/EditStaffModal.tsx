import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, X, Loader2, Save, Shield } from "lucide-react";

export interface StaffEditData {
  user_id: string;
  school_id: string;
  full_name: string;
  email: string | null;
  mobile_number?: string | null;
  designation?: string | null;
  department?: string | null;
  employee_id?: string | null;
  blood_group?: string | null;
  address?: string | null;
  emergency_contact?: string | null;
  roles?: ("admin" | "teacher" | "parent" | "super_admin")[];
}

interface EditStaffModalProps {
  staff: StaffEditData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditStaffModal({
  staff,
  isOpen,
  onClose,
  onUpdated,
}: EditStaffModalProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "teacher">("teacher");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (staff) {
      setFullName(staff.full_name || "");
      setMobileNumber(staff.mobile_number || "");
      setDesignation(staff.designation || "");
      setDepartment(staff.department || "");
      setEmployeeId(staff.employee_id || "");
      setBloodGroup(staff.blood_group || "");
      setAddress(staff.address || "");
      setEmergencyContact(staff.emergency_contact || "");
      setSelectedRole(staff.roles?.includes("admin") ? "admin" : "teacher");
    }
  }, [staff, isOpen]);

  if (!isOpen || !staff) return null;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Staff name is required");
      return;
    }

    setSaving(true);
    try {
      // 1. Update profiles table
      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          mobile_number: mobileNumber.trim() || null,
          designation: designation.trim() || null,
          department: department.trim() || null,
          employee_id: employeeId.trim() || null,
          blood_group: bloodGroup || null,
          address: address.trim() || null,
          emergency_contact: emergencyContact.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", staff.user_id);

      if (profErr) throw profErr;

      // 2. Update user_roles if not super admin
      const isSuper = staff.roles?.includes("super_admin");
      if (!isSuper && staff.school_id) {
        // Delete existing non-super_admin roles for this school
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", staff.user_id)
          .eq("school_id", staff.school_id);

        // Insert new role
        const { error: roleErr } = await supabase.from("user_roles").insert({
          user_id: staff.user_id,
          school_id: staff.school_id,
          role: selectedRole,
        });

        if (roleErr && !roleErr.message.includes("duplicate")) throw roleErr;
      }

      toast.success(`${fullName}'s profile updated successfully!`);
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating staff:", err);
      toast.error(err.message || "Failed to update staff profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card text-card-foreground border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
          <div>
            <h2 className="text-lg font-bold">Edit Staff Profile</h2>
            <p className="text-xs text-muted-foreground">
              Update staff details, designation, department, and system role
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Staff Member Info */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/15 border border-border">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
              {fullName.charAt(0).toUpperCase() || <User className="size-6" />}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{fullName || "Staff Member"}</p>
              <p className="text-xs text-muted-foreground font-mono">{staff.email || "No email"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP-101"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Designation / Job Title
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Math Teacher"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Science / Mathematics"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                System Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "admin" | "teacher")}
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-semibold"
              >
                <option value="teacher">Teacher / Faculty</option>
                <option value="admin">School Administrator</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Residential Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address details..."
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
