import { prisma } from "@/lib/prisma";
import { userSelect } from "./user.types";
import { getCleanSearch, IQueryParams } from "@/lib/filter";
import { UserFilterRole } from "./user.cache";
import { UserWhereInput } from "@/generated/prisma/models";

export class UserRepository {
  async getList({ search, role }: { search?: IQueryParams["search"]; role?: UserFilterRole }) {
    const cleanSearch = getCleanSearch(search);

    let where: UserWhereInput = {};
    if (cleanSearch) {
      where.OR = [
        { username: { contains: cleanSearch } },
        { teacher: { fullName: { contains: cleanSearch } } },
        { teacher: { phone: { contains: cleanSearch } } },
        { classes: { some: { class: { name: { contains: cleanSearch } } } } },
        { subjects: { some: { subject: { name: { contains: cleanSearch } } } } },
      ];
    }

    if (role !== "all") {
      where = { ...where, role: { equals: role } };
    }

    return await prisma.user.findMany({
      where,
      select: userSelect,
    });
  }
}
