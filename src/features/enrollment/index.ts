import { EnrollmentRepository } from "./enrollment.repository";
import { EnrollmentService } from "./enrollment.service";

export const enrollmentRepository = new EnrollmentRepository();
export const enrollmentService = new EnrollmentService(enrollmentRepository);
