const academicYearNames = ["2024", "2025", "2026"] as const;
const classNames = ["T1", "T2", "T3", "T4"] as const;
const examNames = ["1st Term Test", "2nd Term Test", "3rd Term Test"] as const;

const firstNames = [
  "Amaya", "Ayesha", "Bimasha", "Chamath", "Dulanjali", "Eshan", "Fathima",
  "Gehan", "Hansini", "Imesh", "Janani", "Kavindu", "Lakshika", "Minura",
  "Nethmi", "Osanda", "Pavani", "Ravindu", "Sajini", "Tharindu", "Umaya",
  "Vihanga", "Yasara", "Zahra",
];
const lastNames = [
  "Perera", "Fernando", "Silva", "Jayasinghe", "Bandara", "De Alwis",
  "Wickramasinghe", "Gunawardena", "Senanayake", "Karunaratne", "Hassan",
  "Abeysekara", "Wijesinghe", "Rathnayake", "Mendis", "Samarasinghe",
];
const teacherNames = [
  "Nimali Perera", "Kasun Fernando", "Shalini Silva", "Dinesh Jayasinghe",
  "Farah Hassan", "Ruwan Bandara", "Ishara Wickramasinghe", "Malith Mendis",
  "Nadeesha Gunawardena", "Thilini Senanayake", "Sanjaya Karunaratne",
  "Ayesha Abeysekara", "Chamara Wijesinghe", "Sulochana Rathnayake",
  "Asanka Samarasinghe", "Nirosha De Alwis",
];

const id = (...parts: (string | number)[]) =>
  parts.map((part) => String(part).replaceAll(" ", "-")).join("-");
const yearId = (year: string) => `year-${year}`;
const gradeId = (grade: number) => `grade-${grade}`;
const classId = (year: string, grade: number, className: string) =>
  id(year, grade, className);
const studentCohort = (year: string, grade: number) => {
  if (year === "2024" && grade === 12) return "2025";
  if (year === "2025" && grade === 13) return "2025";
  if (year === "2025" && grade === 12) return "2026";
  if (year === "2026" && grade === 13) return "2026";
  return `${year}-grade-${grade}`;
};
const classBatchId = (year: string, grade: number) => {
  const cohort = studentCohort(year, grade);
  return cohort === "2025" || cohort === "2026"
    ? `batch-${cohort}-al`
    : null;
};

export const academicYears = academicYearNames.map((year) => ({
  id: yearId(year),
  name: year,
  startDate: new Date(`${year}-01-01T00:00:00.000Z`),
  endDate: new Date(`${year}-12-31T23:59:59.999Z`),
  isCurrent: year === "2026",
}));

export const batches = [
  { id: "batch-2025-al", name: "2025 A/L" },
  { id: "batch-2026-al", name: "2026 A/L" },
];

export const gradeLevels = [
  {
    id: gradeId(12),
    number: 12,
    name: "Grade 12",
  },
  {
    id: gradeId(13),
    number: 13,
    name: "Grade 13",
  },
];

export const mediums = [
  { id: "medium-sinhala", name: "Sinhala" },
  { id: "medium-english", name: "English" },
];

export const streams = [{ id: "stream-technology", name: "Technology" }];

export const subjects = [
  { id: "subject-et", name: "ET", code: "ET", category: "al_main" as const },
  { id: "subject-bst", name: "BST", code: "BST", category: "al_main" as const },
  { id: "subject-sft", name: "SFT", code: "SFT", category: "al_main" as const },
  { id: "subject-ict", name: "ICT", code: "ICT", category: "al_main" as const },
  {
    id: "subject-general-english",
    name: "General English",
    code: "GE",
    category: "al_common" as const,
  },
  {
    id: "subject-general-knowledge",
    name: "General Knowledge",
    code: "GK",
    category: "al_common" as const,
  },
];

const defaultSubjectIds = {
  T1: ["subject-et", "subject-sft", "subject-ict", "subject-general-english", "subject-general-knowledge"],
  T2: ["subject-et", "subject-sft", "subject-ict", "subject-general-english", "subject-general-knowledge"],
  T3: ["subject-et", "subject-sft", "subject-ict", "subject-general-english", "subject-general-knowledge"],
  T4: ["subject-bst", "subject-sft", "subject-ict", "subject-general-english", "subject-general-knowledge"],
} as const;

const classContexts = academicYearNames.flatMap((year) =>
  [12, 13].flatMap((grade) =>
    classNames.map((className) => ({
      year,
      grade,
      className,
      classId: classId(year, grade, className),
    })),
  ),
);

export const teachers = classContexts.flatMap((context, index) => [
  {
    id: id("class-teacher", context.year, context.grade, context.className),
    fullName: teacherNames[index % teacherNames.length],
    phone: `077${String(1000000 + index).slice(-7)}`,
    isActive: true,
  },
  ...defaultSubjectIds[context.className].map((subjectId, subjectIndex) => ({
    id: id("teacher", context.year, context.grade, context.className, subjectId),
    fullName:
      teacherNames[(index + subjectIndex + 1) % teacherNames.length],
    phone: `071${String(2000000 + index * 10 + subjectIndex).slice(-7)}`,
    isActive: true,
  })),
]);

export const classes = classContexts.map((context) => ({
  id: context.classId,
  academicYearId: yearId(context.year),
  gradeLevelId: gradeId(context.grade),
  streamId: "stream-technology",
  name: `${context.grade} ${context.className}`,
  defaultMediumId: "medium-sinhala",
  batchId: classBatchId(context.year, context.grade),
  classTeacherId: id(
    "class-teacher",
    context.year,
    context.grade,
    context.className,
  ),
}));

export const classSubjects = classContexts.flatMap((context) =>
  defaultSubjectIds[context.className].map((subjectId) => ({
    id: id("class-subject", context.year, context.grade, context.className, subjectId),
    classId: context.classId,
    subjectId,
    mediumId: "medium-sinhala",
    teacherId: id("teacher", context.year, context.grade, context.className, subjectId),
  })),
);

const cohortIds = classContexts.flatMap((context) =>
  Array.from({ length: 20 }, (_, index) => ({
    context,
    index,
    cohort: studentCohort(context.year, context.grade),
    studentId: id(
      "student",
      studentCohort(context.year, context.grade),
      context.className,
      index + 1,
    ),
  })),
);
const uniqueStudents = Array.from(
  new Map(cohortIds.map((entry) => [entry.studentId, entry])).values(),
);

export const students = uniqueStudents.map(({ context, index, cohort, studentId }) => {
  const nameIndex = (index + classNames.indexOf(context.className) * 5) % firstNames.length;
  const surnameIndex =
    (index * 3 + classNames.indexOf(context.className) * 2) % lastNames.length;
  return {
    id: studentId,
    admissionNo: `AL${cohort.replace(/\D/g, "")}-${context.className}-${String(index + 1).padStart(3, "0")}`,
    fullName: `${firstNames[nameIndex]} ${lastNames[surnameIndex]}`,
    dob: new Date(`2008-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}T00:00:00.000Z`),
    gender: index % 2 === 0 ? ("female" as const) : ("male" as const),
    phone: `07${String(70000000 + classNames.indexOf(context.className) * 100000 + index).slice(0, 8)}`,
    address: `${index + 1} School Road`,
    guardianName: `${lastNames[surnameIndex]} Family`,
    guardianPhone: `07${String(71000000 + classNames.indexOf(context.className) * 100000 + index).slice(0, 8)}`,
    status: "active" as const,
  };
});

const enrollmentContexts = classContexts.flatMap((context) =>
  Array.from({ length: 20 }, (_, index) => {
    const cohort = studentCohort(context.year, context.grade);
    const studentId = id("student", cohort, context.className, index + 1);
    return {
      context,
      index,
      studentId,
      enrollmentId: id("enrollment", context.year, context.grade, context.className, index + 1),
    };
  }),
);

export const enrollments = enrollmentContexts.map(
  ({ context, index, studentId, enrollmentId }) => ({
    id: enrollmentId,
    studentId,
    classId: context.classId,
    academicYearId: yearId(context.year),
    classIndex: index + 1,
    status: "active" as const,
    joinedOn: new Date(`${context.year}-01-15T00:00:00.000Z`),
  }),
);

export const enrollmentSubjects = enrollmentContexts.flatMap(
  ({ context, index, enrollmentId }) =>
    defaultSubjectIds[context.className].map((subjectId) => ({
      id: id("enrollment-subject", enrollmentId, subjectId),
      enrollmentId,
      subjectId,
      mediumId:
        subjectId === "subject-ict" && (index + 1) % 7 === 0
          ? "medium-english"
          : "medium-sinhala",
    })),
);

export const exams = academicYearNames.flatMap((year) =>
  [12, 13].flatMap((grade) =>
    examNames.map((name, termIndex) => ({
      id: id("exam", year, grade, termIndex + 1),
      academicYearId: yearId(year),
      gradeLevelId: gradeId(grade),
      name,
    })),
  ),
);

export const examSubjects = exams.flatMap((exam) =>
  subjects.map((subject) => ({
    id: id("exam-subject", exam.id, subject.id),
    examId: exam.id,
    subjectId: subject.id,
    maxMarks: 100,
    passMark: 35,
  })),
);

export const marks = exams.flatMap((exam, examIndex) => {
  const [year, gradeText] = exam.id.slice("exam-".length).split("-");
  const grade = Number(gradeText);
  const termIndex = examIndex % examNames.length;
  const absentClasses = [
    { className: classNames[termIndex], classIndex: 0 },
    {
      className: classNames[(termIndex + 1) % classNames.length],
      classIndex: 1,
    },
  ];
  const examEnrollments = enrollmentContexts.filter(
    ({ context }) => context.year === year && context.grade === grade,
  );
  return examEnrollments.flatMap(({ context, index, enrollmentId }) => {
    const absent = absentClasses.some(
      (entry) =>
        entry.className === context.className && entry.classIndex === index,
    );
    return defaultSubjectIds[context.className].map((subjectId, subjectIndex) => ({
        id: id("mark", exam.id, enrollmentId, subjectId),
        examId: exam.id,
        enrollmentId,
        subjectId,
        marks: absent
          ? null
          : 35 + ((index * 13 + subjectIndex * 11 + examIndex * 7) % 66),
        status: absent ? ("absent" as const) : ("present" as const),
      }));
  });
});