import { ApiError } from "@/lib/ApiError";
import { EnrollmentRepository } from "../enrollment/enrollment.repository";
import { ExamRepository } from "./exams.repository";
import { IExamByEnrollmentId } from "./exams.types";

export class ExamService {
  constructor(
    private repository: ExamRepository,
    private enrollmentRepository: EnrollmentRepository,
  ) {}

  async getDataByEnrollmentId(enrollmentId: string): Promise<IExamByEnrollmentId[]> {
    const enrollment = await this.enrollmentRepository.getById(enrollmentId);

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    const exams = await this.repository.getList(enrollment.academicYearId, enrollment.class.gradeLevelId);

    const marksByExamAndSubject = new Map(enrollment.marks.map((mark) => [`${mark.examId}:${mark.subjectId}`, mark]));

    return exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      subjects: enrollment.subjects.map(({ subject, medium }) => {
        const mark = marksByExamAndSubject.get(`${exam.id}:${subject.id}`);

        return {
          id: subject.id,
          name: subject.name,
          code: subject.code,
          category: subject.category,
          medium: medium?.name ?? null,
          result: {
            marks: mark?.marks ?? null,
            status: mark?.status ?? null,
          },
        };
      }),
    }));
  }
}
