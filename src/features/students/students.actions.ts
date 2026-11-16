"use server";

import {
  IStudentEnrollment,
  IStudentJsonField,
  IStudentList,
  IStudentProfile,
  IStudentsListItem,
  IStudentsListWithSubjectsItem,
} from "./students.types";
import { requireAuthServerAction } from "@/lib/auth/authenticate";
import { IStudentDetailsData } from "@/components/pages/exams/student-details-view-button";
import { subjectRepository } from "../subjects";
import { studentsService } from ".";
import { revalidatePath } from "next/cache";
import { studentJsonFieldSchema, studentSchema } from "./student.schema";
import { IQueryParams } from "@/lib/filter";
import { examService } from "../exams";
import { ApiErrorV2 } from "@/lib/ApiError";
import { IResponse } from "@/lib/types";
import { Route } from "next";
import z from "zod";

export async function getStudentListAction({ search, page, limit }: IQueryParams): Promise<IResponse<IStudentList>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await studentsService.getList({ search, page, limit });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching student list:", error);
    return { success: false, message: "Failed to fetch student list." };
  }
}

export async function getStudentDetailsAction(
  studentId: string,
  classId: string,
): Promise<IResponse<IStudentDetailsData>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const student = await studentsService.getById(classId, studentId);
    const [examData, subjectList] = await Promise.all([
      examService.getDataByEnrollmentId(student.enrollment.id),
      subjectRepository.getListByEnrollmentId(student.enrollment.id),
    ]);
    return { success: true, data: { student, examData, subjectList } };
  } catch (error) {
    console.error("Error fetching data for student details:", error);
    return { success: false, message: "Failed to fetch data for student details" };
  }
}

export async function getStudentListForClassAction(classId: string): Promise<IResponse<IStudentsListItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  try {
    const result = await studentsService.getListForClass(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class student list:", error);
    return { success: false, message: "Failed to fetch class student list." };
  }
}

export async function getStudentProfileListForClassAction(classId: string): Promise<IResponse<IStudentProfile[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  try {
    const result = await studentsService.getProfileListForClass(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class student list:", error);
    return { success: false, message: "Failed to fetch class student profile list." };
  }
}

export async function getStudentListForClassWithSubjectsAction(
  classId: string,
): Promise<IResponse<IStudentsListWithSubjectsItem[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!classId) {
    return { success: false, message: "Class id is required" };
  }

  try {
    const result = await studentsService.getListForClassWithSubjects(classId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching class student list:", error);
    return { success: false, message: "Failed to fetch class student list." };
  }
}

export async function getStudentEnrollmentsAction(studentId: string): Promise<IResponse<IStudentEnrollment[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId) {
    return { success: false, message: "Student id is required" };
  }

  try {
    const result = await studentsService.getEnrollmentsById(studentId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching student enrollment list:", error);
    return { success: false, message: "Failed to fetch student enrollment list." };
  }
}

export async function createStudentAction(data: z.infer<typeof studentSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedData = studentSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await studentsService.create(parsedData.data);
    revalidatePath("/setup/students" as Route);
    return { success: true, message: "Student Created" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function updateStudentAction(studentId: string, data: z.infer<typeof studentSchema>): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId) {
    return { success: false, message: "Student id is required" };
  }

  const parsedData = studentSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    await studentsService.update(studentId, parsedData.data);
    revalidatePath("/setup/students" as Route);
    return { success: true, message: "Student Updated" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function deleteStudentAction(studentId: string): Promise<IResponse> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  if (!studentId) {
    return { success: false, message: "Student id is required" };
  }

  try {
    await studentsService.delete(studentId);
    revalidatePath("/setup/students" as Route);
    return { success: true, message: "Student Deleted" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Unknown error occured" };
  }
}

export async function getStudentJsonFieldsAction(): Promise<IResponse<IStudentJsonField[]>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  try {
    const result = await studentsService.getJsonFields();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return { success: false, message: "Failed to fetch custom fields." };
  }
}

export async function createStudentJsonFieldAction(
  data: z.infer<typeof studentJsonFieldSchema>,
): Promise<IResponse<IStudentJsonField>> {
  await requireAuthServerAction({ requiredRoles: ["admin"] });

  const parsedRes = studentJsonFieldSchema.safeParse(data);
  if (!parsedRes.success) {
    return { success: false, message: "Invalid data provided" };
  }

  try {
    const result = await studentsService.createJsonField(parsedRes.data);
    revalidatePath("/setup/students" as Route);
    return { success: true, data: result, message: "Custom field created successfully" };
  } catch (error) {
    if (error instanceof ApiErrorV2) {
      return { success: false, message: error.message };
    }
    console.error("Error creating custom field:", error);
    return { success: false, message: "Unknown error occurred" };
  }
}
