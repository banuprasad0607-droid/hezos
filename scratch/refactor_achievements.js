import fs from "fs";
import path from "path";

const filePath = "src/routes/_authenticated/achievements.tsx";
let content = fs.readFileSync(filePath, "utf8");

// 1. Add useTenant import
content = content.replace(
  'import { useSchoolContext } from "@/lib/school-context";',
  'import { useSchoolContext } from "@/lib/school-context";\nimport { useTenant } from "@/lib/tenant-context";',
);

// 2. Update useAuth/useSchoolContext to useTenant
content = content.replace(
  `  const { schoolId, user, roles, signOut } = useAuth();
  const { activeSchool } = useSchoolContext();`,
  `  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();
  const { signOut } = useAuth();`,
);

// 3. Add loading check
content = content.replace(
  `  return (
    <>
      <PageHeader`,
  `  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader`,
);

// 4. Replace subject_allocations table name
content = content.replace(/"subject_allocations"/g, '"teacher_allocations"');

// 5. Replace block 1: classEx and studentMarks fetch (lines 654-670 approx)
const targetBlock1 = `        // 1. Fetch class exams
        const { data: classEx } = await supabase
          .from("exams")
          .select("id, name, max_marks, subject_id")
          .eq("school_id", schoolId)
          .eq("class_id", classId)
          .is("deleted_at", null);
          
        const examIds = (classEx || []).map(e => e.id);
        
        // 2. Fetch marks for this student
        const { data: studentMarks } = await supabase
          .from("exam_marks")
          .select("exam_id, marks_obtained")
          .eq("student_id", reportCardStudent.id)
          .is("deleted_at", null)
          .in("exam_id", examIds.length ? examIds : ["00000000-0000-0000-0000-000000000000"]);`;

const replacementBlock1 = `        // 1. Fetch class exams
        const { data: classExData } = await supabase
          .from("exams")
          .select("id, name")
          .eq("school_id", schoolId)
          .eq("class_id", classId)
          .is("deleted_at", null);
          
        const rawExamIds = (classExData || []).map(e => e.id);

        // Fetch exam_subjects
        const { data: examSubjs } = await supabase
          .from("exam_subjects")
          .select("id, exam_id, subject_id, max_marks")
          .eq("school_id", schoolId)
          .in("exam_id", rawExamIds.length ? rawExamIds : ["00000000-0000-0000-0000-000000000000"]);

        const classEx: any[] = [];
        (examSubjs || []).forEach(es => {
          const exam = (classExData || []).find(e => e.id === es.exam_id);
          if (exam) {
            classEx.push({
              id: es.id,
              name: exam.name,
              max_marks: Number(es.max_marks || 100),
              subject_id: es.subject_id
            });
          }
        });
        const mappedExamIds = classEx.map(c => c.id);
        
        // 2. Fetch marks for this student
        const { data: studentMarksData } = await supabase
          .from("mark_entries")
          .select("exam_subject_id, marks_obtained")
          .eq("student_id", reportCardStudent.id)
          .is("deleted_at", null)
          .in("exam_subject_id", mappedExamIds.length ? mappedExamIds : ["00000000-0000-0000-0000-000000000000"]);

        const studentMarks = (studentMarksData || []).map(m => ({
          exam_id: m.exam_subject_id,
          marks_obtained: m.marks_obtained
        }));`;

if (content.includes(targetBlock1)) {
  content = content.replace(targetBlock1, replacementBlock1);
  console.log("Successfully replaced Block 1 (individual student report card details)");
} else {
  console.error("Failed to find Block 1");
}

// 6. Replace block 2: Fetch Exams & Marks in loadData (lines 1159-1178 approx)
const targetBlock2 = `      // 4) Fetch Exams
       const { data: examsData } = await supabase
          .from("exams")
          .select("id, class_id, name, type, max_marks, subject_id, date")
          .eq("school_id", schoolId)
          .is("deleted_at", null)
          .order("date", { ascending: false });
        setExams(examsData || []);
       if (examsData && examsData.length > 0 && !selectedExam) {
         setSelectedExam(examsData[0].id);
       }

       // 5) Fetch Marks
       const { data: marksData } = await supabase
         .from("exam_marks")
         .select("id, student_id, exam_id, marks_obtained")
         .eq("school_id", schoolId)
         .is("deleted_at", null);
       setMarks(marksData || []);`;

const replacementBlock2 = `      // 4) Fetch Exams & Subjects
      const { data: rawExams } = await supabase
        .from("exams")
        .select("id, class_id, name, type, date")
        .eq("school_id", schoolId)
        .is("deleted_at", null);
      
      const { data: examSubjs } = await supabase
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks")
        .eq("school_id", schoolId);

      const combinedExams: any[] = [];
      (examSubjs || []).forEach(es => {
        const exam = (rawExams || []).find(e => e.id === es.exam_id);
        if (exam) {
          combinedExams.push({
            id: es.id,
            exam_id: exam.id,
            class_id: exam.class_id,
            name: \`\${exam.name} - \${es.subject_id}\`,
            type: exam.type,
            max_marks: Number(es.max_marks || 100),
            subject_id: es.subject_id,
            date: exam.date
          });
        }
      });
      combinedExams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExams(combinedExams);
      if (combinedExams.length > 0 && !selectedExam) {
        setSelectedExam(combinedExams[0].id);
      }

      // 5) Fetch Marks
      const { data: rawMarks } = await supabase
        .from("mark_entries")
        .select("id, student_id, exam_id, exam_subject_id, marks_obtained")
        .eq("school_id", schoolId)
        .is("deleted_at", null);

      const mappedMarks = (rawMarks || []).map(m => ({
        id: m.id,
        student_id: m.student_id,
        exam_id: m.exam_subject_id,
        marks_obtained: m.marks_obtained
      }));
      setMarks(mappedMarks);`;

if (content.includes(targetBlock2)) {
  content = content.replace(targetBlock2, replacementBlock2);
  console.log("Successfully replaced Block 2 (loadData exams & marks)");
} else {
  // Let's do a looser match in case spacing/formatting differs
  console.error("Failed to find Block 2");
}

// 7. Replace block 3: Class rankings marks calculation (lines 1405-1425 approx)
const targetBlock3 = `      // 2) Fetch exams and marks for the class
      const { data: classExams } = await supabase
        .from("exams")
        .select("id, max_marks, subject_id, name")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);

      if (!classExams || classExams.length === 0) {
        toast.error("No exams set up for this class to calculate marks");
        setIsCalculating(false);
        return;
      }

      const examIds = classExams.map(e => e.id);
      const { data: classMarks } = await supabase
        .from("exam_marks")
        .select("student_id, exam_id, marks_obtained")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .in("exam_id", examIds);`;

const replacementBlock3 = `      // 2) Fetch exams and marks for the class
      const { data: classExamsData } = await supabase
        .from("exams")
        .select("id, name")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);

      if (!classExamsData || classExamsData.length === 0) {
        toast.error("No exams set up for this class to calculate marks");
        setIsCalculating(false);
        return;
      }

      const rawExamIds = classExamsData.map(e => e.id);
      const { data: examSubjs } = await supabase
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks")
        .eq("school_id", schoolId)
        .in("exam_id", rawExamIds);

      const classExams: any[] = [];
      (examSubjs || []).forEach(es => {
        const exam = classExamsData.find(e => e.id === es.exam_id);
        if (exam) {
          classExams.push({
            id: es.id,
            name: exam.name,
            max_marks: Number(es.max_marks || 100),
            subject_id: es.subject_id
          });
        }
      });

      if (classExams.length === 0) {
        toast.error("No subjects set up for exams in this class");
        setIsCalculating(false);
        return;
      }

      const examIds = classExams.map(e => e.id);
      const { data: classMarksData } = await supabase
        .from("mark_entries")
        .select("student_id, exam_subject_id, marks_obtained")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .in("exam_subject_id", examIds);

      const classMarks = (classMarksData || []).map(m => ({
        student_id: m.student_id,
        exam_id: m.exam_subject_id,
        marks_obtained: m.marks_obtained
      }));`;

if (content.includes(targetBlock3)) {
  content = content.replace(targetBlock3, replacementBlock3);
  console.log("Successfully replaced Block 3 (rankings calculation)");
} else {
  console.error("Failed to find Block 3");
}

// 8. Replace block 4: mock seeder (lines 1885-1936 approx)
const targetBlock4 = `    const examNamePrefix = selectedReportCardExam;
    const { data: dbExams } = await supabase
      .from("exams")
      .select("id, subject_id, name")
      .eq("school_id", schoolId!)
      .eq("class_id", targetClassId)
      .eq("type", selectedReportCardExam)
      .is("deleted_at", null);

    const finalExamsMap = new Map<string, string>();
    (dbExams || []).forEach(e => {
      if (e.subject_id) finalExamsMap.set(e.subject_id, e.id);
    });

    for (const [subjName, subjId] of finalSubjectsMap.entries()) {
      if (!finalExamsMap.has(subjId)) {
        const { data: newExam } = await supabase
          .from("exams")
          .insert({
            school_id: schoolId!,
            class_id: targetClassId,
            subject_id: subjId,
            name: \`\${examNamePrefix} - \${subjName}\`,
            type: selectedReportCardExam,
            max_marks: 100,
            date: new Date().toISOString().slice(0, 10)
          })
          .select("id")
          .single();
        if (newExam) finalExamsMap.set(subjId, newExam.id);
      }
    }

    const marksToInsert = [];
    for (const stud of classStuds) {
      for (const [subjId, examId] of finalExamsMap.entries()) {
        const existingMark = marks.find(m => m.student_id === stud.id && m.exam_id === examId);
        if (!existingMark) {
          const obtained = Math.floor(Math.random() * 53) + 45;
          marksToInsert.push({
            school_id: schoolId!,
            exam_id: examId,
            student_id: stud.id,
            marks_obtained: obtained
          });
        }
      }
    }

    if (marksToInsert.length > 0) {
      await supabase.from("exam_marks").insert(marksToInsert);
    }`;

const replacementBlock4 = `    const examNamePrefix = selectedReportCardExam;
    const { data: dbExams } = await supabase
      .from("exams")
      .select("id, name")
      .eq("school_id", schoolId!)
      .eq("class_id", targetClassId)
      .eq("type", selectedReportCardExam)
      .is("deleted_at", null);

    let generalExam = (dbExams || []).find(e => e.name === examNamePrefix);
    if (!generalExam) {
      const { data: newExam, error: examErr } = await supabase
        .from("exams")
        .insert({
          school_id: schoolId!,
          class_id: targetClassId,
          name: examNamePrefix,
          type: selectedReportCardExam,
          date: new Date().toISOString().slice(0, 10)
        })
        .select("id")
        .single();
      if (examErr) throw examErr;
      generalExam = newExam;
    }

    const examId = generalExam.id;

    // Fetch existing exam_subjects for this exam
    const { data: dbExamSubjs } = await supabase
      .from("exam_subjects")
      .select("id, subject_id")
      .eq("exam_id", examId);

    const examSubjMap = new Map<string, string>(); // subjectId -> examSubjectId
    (dbExamSubjs || []).forEach(es => {
      examSubjMap.set(es.subject_id, es.id);
    });

    for (const [subjName, subjId] of finalSubjectsMap.entries()) {
      if (!examSubjMap.has(subjId)) {
        const { data: newES, error: esErr } = await supabase
          .from("exam_subjects")
          .insert({
            school_id: schoolId!,
            exam_id: examId,
            subject_id: subjId,
            max_marks: 100,
            pass_marks: 35
          })
          .select("id")
          .single();
        if (esErr) throw esErr;
        if (newES) examSubjMap.set(subjId, newES.id);
      }
    }

    // Now seed mark_entries (formerly exam_marks)
    const { data: existingMarks } = await supabase
      .from("mark_entries")
      .select("student_id, exam_subject_id")
      .eq("exam_id", examId);

    const marksToInsert = [];
    for (const stud of classStuds) {
      for (const [subjId, esId] of examSubjMap.entries()) {
        const hasMark = (existingMarks || []).some(m => m.student_id === stud.id && m.exam_subject_id === esId);
        if (!hasMark) {
          const obtained = Math.floor(Math.random() * 53) + 45;
          marksToInsert.push({
            school_id: schoolId!,
            exam_id: examId,
            exam_subject_id: esId,
            student_id: stud.id,
            marks_obtained: obtained,
            grade: obtained >= 91 ? "A+" : obtained >= 81 ? "A" : obtained >= 71 ? "B+" : obtained >= 61 ? "B" : obtained >= 51 ? "C+" : obtained >= 41 ? "C" : obtained >= 35 ? "D" : "F",
            remarks: "Demo score",
            status: "Draft"
          });
        }
      }
    }

    if (marksToInsert.length > 0) {
      await supabase.from("mark_entries").insert(marksToInsert);
    }`;

if (content.includes(targetBlock4)) {
  content = content.replace(targetBlock4, replacementBlock4);
  console.log("Successfully replaced Block 4 (mock seeder internal)");
} else {
  console.error("Failed to find Block 4");
}

// 9. Replace block 5: handleGenerateClassReportCardsInternal marks fetch (lines 2010-2019 approx)
const targetBlock5 = `    const classExams = exams.filter(e => e.class_id === targetClassId && e.type === selectedReportCardExam);
    if (classExams.length === 0) return;

    const examIds = classExams.map(e => e.id);
    const { data: dbMarks } = await supabase
      .from("exam_marks")
      .select("student_id, exam_id, marks_obtained")
      .eq("school_id", schoolId!)
      .in("exam_id", examIds);`;

const replacementBlock5 = `    const classExams = exams.filter(e => e.class_id === targetClassId && e.type === selectedReportCardExam);
    if (classExams.length === 0) return;

    const examIds = classExams.map(e => e.id);
    const { data: dbMarksData } = await supabase
      .from("mark_entries")
      .select("student_id, exam_subject_id, marks_obtained")
      .eq("school_id", schoolId!)
      .in("exam_subject_id", examIds);

    const dbMarks = (dbMarksData || []).map(m => ({
      student_id: m.student_id,
      exam_id: m.exam_subject_id,
      marks_obtained: m.marks_obtained
    }));`;

if (content.includes(targetBlock5)) {
  content = content.replace(targetBlock5, replacementBlock5);
  console.log("Successfully replaced Block 5 (handleGenerateClassReportCardsInternal)");
} else {
  console.error("Failed to find Block 5");
}

// 10. Replace any remaining exam_marks select statements (lines 2198, 2233 approx)
content = content.replace(/supabase\.from\("exam_marks"\)/g, 'supabase.from("mark_entries")');

// Write back content
fs.writeFileSync(filePath, content, "utf8");
console.log("Finished refactoring achievements.tsx!");
