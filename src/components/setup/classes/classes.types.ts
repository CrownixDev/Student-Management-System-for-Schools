import { SubjectCategory } from "@/generated/prisma/enums";

export interface IClassSubjectItem {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string | null;
  category: SubjectCategory;
  mediumId: string | null;
  mediumName: string;
  teacherId: string;
  teacherName: string;
}

export interface IEnrolledStudentItem {
  id: string; // enrollmentId
  studentId: string;
  classIndex: number; // roll number
  status: "active" | "completed" | "repeated";
  admissionNo: string;
  fullName: string;
  gender: "male" | "female";
  phone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  joinedOn: string;
}

export interface IClassDetail {
  id: string;
  name: string;
  academicYearId: string;
  academicYear: {
    id: string;
    name: string;
    isCurrent: boolean;
  };
  gradeLevelId: string;
  gradeLevel: {
    id: string;
    number: number;
    name: string;
  };
  streamId: string | null;
  stream: {
    id: string;
    name: string;
  } | null;
  defaultMediumId: string | null;
  defaultMedium: {
    id: string;
    name: string;
  } | null;
  classTeacherId: string | null;
  classTeacher: {
    id: string;
    fullName: string;
    phone: string | null;
  } | null;
  batchId: string | null;
  batch: {
    id: string;
    name: string;
  } | null;
  classSubjects: IClassSubjectItem[];
  enrollments: IEnrolledStudentItem[];
}

export interface IGradeClassesGroup {
  gradeId: string;
  gradeNumber: number;
  gradeName: string;
  classes: Array<{
    id: string;
    name: string;
    studentCount: number;
    subjectCount: number;
    streamName?: string | null;
    defaultMediumName?: string | null;
    classTeacherName?: string | null;
  }>;
}

export interface IReferenceOptions {
  academicYears: Array<{ id: string; name: string; isCurrent: boolean }>;
  grades: Array<{ id: string; number: number; name: string }>;
  mediums: Array<{ id: string; name: string }>;
  streams: Array<{ id: string; name: string }>;
  batches: Array<{ id: string; name: string }>;
  teachers: Array<{ id: string; fullName: string }>;
  subjects: Array<{ id: string; name: string; code: string | null; category: SubjectCategory }>;
}

export interface IPreviousClassOption {
  yearId: string;
  yearName: string;
  classId: string;
  className: string;
  gradeName: string;
  students: Array<{
    studentId: string;
    admissionNo: string;
    fullName: string;
    gender: "male" | "female";
    currentClassIndex: number;
  }>;
}
