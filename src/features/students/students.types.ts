import { StudentGetPayload, StudentSelect } from "@/generated/prisma/models";

export const studentListSelect = {
  id: true,
  admissionNo: true,
  fullName: true,
  enrollments: {
    select: {
      classIndex: true,
    },
  },
} satisfies StudentSelect;

export type IStudentsListItem = StudentGetPayload<{
  select: typeof studentListSelect;
}>;

export const studentSelect = {
  id: true,
  admissionNo: true,
  fullName: true,
  dob: true,
  gender: true,
  nic: true,
  phone: true,
  address: true,
  guardianName: true,
  guardianPhone: true,

  enrollments: {
    select: {
      id: true,
      status: true,
      classIndex: true,
      marks: {
        select: {
          exam: {
            select: {
              name: true,
            },
          },
          marks: true,
          status: true,
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
} satisfies StudentSelect;

export type IStudent = StudentGetPayload<{
  select: typeof studentSelect;
}>;
