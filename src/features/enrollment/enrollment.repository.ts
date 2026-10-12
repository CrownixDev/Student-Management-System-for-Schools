import { prisma } from "@/lib/prisma";

export class EnrollmentRepository {
  async getById(id: string) {
    return await prisma.enrollment.findUnique({
      where: { id },
      include: {
        subjects: { include: { subject: true, medium: true } },
        marks: true,
        class: true,
      },
    });
  }
}
