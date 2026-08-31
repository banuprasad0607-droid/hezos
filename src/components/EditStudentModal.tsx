import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropper } from "@/components/ImageCropper";
import { optimizeImage } from "@/lib/image-optimizer";
import { toast } from "sonner";
import { User, Camera, X, Loader2, Save } from "lucide-react";

export interface StudentEditData {
  id: string;
  school_id: string;
  full_name: string;
  admission_number: string | null;
  roll_number: string | null;
  class_id: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  address: string | null;
  emergency_contact: string | null;
  photo_url: string | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  parent_user_id: string | null;
}

interface EditStudentModalProps {
  student: StudentEditData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  classes?: Array<{ id: string; name: string; section?: string | null }>;
}

export function EditStudentModal({
  student,
  isOpen,
  onClose,
  onUpdated,
  classes = [],
}: EditStudentModalProps) {
  const [fullName, setFullName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [cropTarget, setCropTarget] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFullName(student.full_name || "");
      setAdmissionNumber(student.admission_number || "");
      setRollNumber(student.roll_number || "");
      setClassId(student.class_id || "");
      setDateOfBirth(student.date_of_birth || "");
      setGender(student.gender || "");
      setBloodGroup(student.blood_group || "");
      setAddress(student.address || "");
      setEmergencyContact(student.emergency_contact || "");
      setParentName(student.parent_name || "");
      setParentEmail(student.parent_email || "");
      setParentPhone(student.parent_phone || "");
      setPhotoUrl(student.photo_url || null);
      setCroppedPhoto(null);
      setCropTarget(null);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropTarget(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Student name is required");
      return;
    }

    setSaving(true);
    try {
      let finalPhotoUrl = photoUrl;

      // If a new photo was cropped, upload it
      if (croppedPhoto) {
        const byteString = atob(croppedPhoto.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

        const optimized = await optimizeImage(file, 300, 0.8, 150 * 1024);
        const path = `${student.school_id}/student/admission-${Date.now()}.webp`;

        const { error: uploadErr } = await supabase.storage
          .from("student-photos")
          .upload(path, optimized, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadErr) throw uploadErr;

        const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
        finalPhotoUrl = pubUrl.publicUrl;
      }

      // Update students table
      const { error: updateErr } = await supabase
        .from("students")
        .update({
          full_name: fullName.trim(),
          admission_number: admissionNumber.trim() || null,
          roll_number: rollNumber.trim() || null,
          class_id: classId || null,
          date_of_birth: dateOfBirth || null,
          gender: gender || null,
          blood_group: bloodGroup || null,
          address: address.trim() || null,
          emergency_contact: emergencyContact.trim() || null,
          parent_name: parentName.trim() || null,
          parent_email: parentEmail.trim() || null,
          parent_phone: parentPhone.trim() || null,
          photo_url: finalPhotoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id);

      if (updateErr) throw updateErr;

      // If parent_user_id exists, update parent profile as well
      if (student.parent_user_id && parentName.trim()) {
        await supabase
          .from("profiles")
          .update({
            full_name: parentName.trim(),
            mobile_number: parentPhone.trim() || null,
          })
          .eq("user_id", student.parent_user_id);
      }

      toast.success(`${fullName}'s profile updated successfully!`);
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating student:", err);
      toast.error(err.message || "Failed to update student profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
            <div>
              <h2 className="text-lg font-bold">Edit Student Profile</h2>
              <p className="text-xs text-muted-foreground">
                Update academic credentials and parent contact information
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
          <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Top Photo & Primary Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-xl bg-secondary/15 border border-border">
              {/* Photo Area */}
              <div className="relative group flex-shrink-0">
                <div className="size-24 rounded-2xl border-2 border-primary/20 bg-background overflow-hidden shadow-inner flex items-center justify-center">
                  {croppedPhoto || photoUrl ? (
                    <img
                      src={croppedPhoto || photoUrl!}
                      alt="Student"
                      className="size-full object-cover"
                    />
                  ) : (
                    <User className="size-10 text-muted-foreground/50" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg hover:bg-primary/90 cursor-pointer transition-transform group-hover:scale-105">
                  <Camera className="size-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              </div>

              {/* Basic Fields */}
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Admission Number
                  </label>
                  <input
                    type="text"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="e.g. 2026-0001"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 01"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Academic & Personal Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Academic & Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Class</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.section ? `(${c.section})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Blood Group</label>
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

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-foreground mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, Postal Code"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Parent & Guardian Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Parent & Guardian Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Robert Doe"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Parent Mobile Number</label>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Parent Email</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
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
                    Saving Changes…
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

      {/* Image Cropper Modal */}
      {cropTarget && (
        <ImageCropper
          imageSrc={cropTarget}
          onCrop={(b64) => {
            setCroppedPhoto(b64);
            setCropTarget(null);
          }}
          onCancel={() => setCropTarget(null)}
          circular={false}
          cropSize={300}
        />
      )}
    </>
  );
}
