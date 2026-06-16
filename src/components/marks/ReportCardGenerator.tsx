import React from "react";
import { format } from "date-fns";

interface ReportCardProps {
  school: {
    name: string;
    logo_url?: string;
    address?: string;
    phone?: string;
  };
  exam: {
    name: string;
    academic_year: string;
  };
  student: {
    full_name: string;
    roll_number: string;
    admission_number: string;
    class_name: string;
    section: string;
    photo_url?: string;
    attendance_pct?: number;
  };
  marks: Array<{
    subject: string;
    max_marks: number;
    pass_marks: number;
    obtained: number;
    grade: string;
    remarks: string;
    is_absent: boolean;
    is_medical_exempt: boolean;
  }>;
  overallRemarks: string;
}

export function ReportCardGenerator({ school, exam, student, marks, overallRemarks }: ReportCardProps) {
  // Calculations
  const totalMax = marks.reduce((sum, m) => sum + m.max_marks, 0);
  const totalObtained = marks.reduce((sum, m) => {
    if (m.is_absent || m.is_medical_exempt) return sum;
    return sum + m.obtained;
  }, 0);
  
  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  
  // Basic overall grade logic
  const getOverallGrade = (pct: number) => {
    if (pct >= 91) return "A+";
    if (pct >= 81) return "A";
    if (pct >= 71) return "B+";
    if (pct >= 61) return "B";
    if (pct >= 51) return "C+";
    if (pct >= 41) return "C";
    if (pct >= 35) return "D";
    return "F";
  };

  return (
    <div className="bg-white w-[794px] min-h-[1123px] p-10 font-sans text-slate-800 mx-auto shadow-xl relative overflow-hidden" style={{ boxSizing: "border-box" }}>
      {/* Decorative Border */}
      <div className="absolute inset-4 border-[3px] border-double border-slate-800 pointer-events-none rounded-sm opacity-20"></div>
      <div className="absolute inset-5 border border-slate-800 pointer-events-none rounded opacity-10"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8 relative z-10">
        <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
          {school.logo_url ? (
            <img src={school.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
          ) : (
            <div className="text-3xl font-black text-slate-300">Logo</div>
          )}
        </div>
        <div className="flex-1 text-center px-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{school.name}</h1>
          <p className="text-sm font-medium text-slate-600 mt-1 uppercase tracking-widest">{school.address || "School Address Not Provided"}</p>
          <p className="text-xs text-slate-500 mt-0.5">Ph: {school.phone || "N/A"}</p>
        </div>
        <div className="w-24 h-24 shrink-0">
           {/* Placeholder to balance logo */}
        </div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-xl font-bold tracking-widest uppercase bg-slate-800 text-white inline-block px-6 py-1.5 rounded-full shadow-sm">
          Report Card
        </h2>
        <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">{exam.name} • {exam.academic_year}</p>
      </div>

      {/* Student Details */}
      <div className="flex gap-6 mb-8 relative z-10">
        <div className="w-32 h-36 border-2 border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
          {student.photo_url ? (
            <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-300 font-bold text-xs uppercase tracking-widest text-center px-2">No Photo</div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="border-b border-slate-200 pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
            <span className="font-bold text-lg">{student.full_name}</span>
          </div>
          <div className="border-b border-slate-200 pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class & Section</span>
            <span className="font-bold text-lg">{student.class_name} - {student.section?.toUpperCase()}</span>
          </div>
          <div className="border-b border-slate-200 pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roll Number</span>
            <span className="font-semibold text-slate-700">{student.roll_number || "N/A"}</span>
          </div>
          <div className="border-b border-slate-200 pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission Number</span>
            <span className="font-semibold text-slate-700">{student.admission_number || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="mb-8 relative z-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-800">
              <th className="py-3 px-4 text-left font-bold text-sm uppercase tracking-wider">Subject</th>
              <th className="py-3 px-4 text-center font-bold text-sm uppercase tracking-wider">Max</th>
              <th className="py-3 px-4 text-center font-bold text-sm uppercase tracking-wider">Pass</th>
              <th className="py-3 px-4 text-center font-bold text-sm uppercase tracking-wider">Obtained</th>
              <th className="py-3 px-4 text-center font-bold text-sm uppercase tracking-wider">Grade</th>
              <th className="py-3 px-4 text-left font-bold text-sm uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m, idx) => (
              <tr key={idx} className="border-b border-slate-200 even:bg-slate-50/50">
                <td className="py-2.5 px-4 font-bold text-slate-700">{m.subject}</td>
                <td className="py-2.5 px-4 text-center font-medium text-slate-500">{m.max_marks}</td>
                <td className="py-2.5 px-4 text-center font-medium text-slate-400">{m.pass_marks}</td>
                <td className="py-2.5 px-4 text-center font-bold">
                  {m.is_absent ? (
                    <span className="text-rose-600 text-xs tracking-wider">ABS</span>
                  ) : m.is_medical_exempt ? (
                    <span className="text-blue-600 text-xs tracking-wider">MED</span>
                  ) : (
                    m.obtained
                  )}
                </td>
                <td className="py-2.5 px-4 text-center font-black">{m.grade}</td>
                <td className="py-2.5 px-4 text-xs font-medium text-slate-600 italic">{m.remarks || "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-[3px] border-slate-800 bg-slate-50">
              <td className="py-4 px-4 font-black uppercase text-right tracking-widest" colSpan={3}>Grand Total:</td>
              <td className="py-4 px-4 text-center font-black text-xl">{totalObtained} / {totalMax}</td>
              <td className="py-4 px-4 text-center font-black text-xl text-brand">{percentage.toFixed(1)}%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-6 mb-12 relative z-10">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Grade</p>
          <p className="text-3xl font-black text-slate-800">{getOverallGrade(percentage)}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
          <p className="text-3xl font-black text-slate-800">{student.attendance_pct ?? "—"}%</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Result</p>
          <p className={`text-2xl font-black ${percentage >= 35 ? "text-emerald-600" : "text-rose-600"} mt-1 uppercase tracking-widest`}>
            {percentage >= 35 ? "Pass" : "Fail"}
          </p>
        </div>
      </div>

      {/* Remarks */}
      <div className="mb-12 relative z-10">
        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2 mb-3">Class Teacher Remarks</h4>
        <p className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[80px]">
          {overallRemarks || "No remarks provided."}
        </p>
      </div>

      {/* Signatures */}
      <div className="mt-24 pt-8 border-t border-slate-200 flex justify-between px-10 relative z-10">
        <div className="text-center">
          <div className="w-40 border-b border-slate-800 mb-2"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Class Teacher</span>
        </div>
        <div className="text-center">
          <div className="w-40 border-b border-slate-800 mb-2"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal</span>
        </div>
        <div className="text-center">
          <div className="w-40 border-b border-slate-800 mb-2"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Parent / Guardian</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[9px] text-slate-400 font-medium tracking-widest uppercase">
        Generated on {format(new Date(), "MMM dd, yyyy")} • Hezo School Connect
      </div>
    </div>
  );
}
