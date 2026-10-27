import { IQueryParams } from "@/lib/filter";
import { UserRepository } from "./user.repository";
import { IUser } from "./user.types";
import { UserFilterRole } from "./user.cache";

export class UserService {
  constructor(private repository: UserRepository) {}

  async getList({
    search,
    role = "all",
  }: {
    search?: IQueryParams["search"];
    role?: UserFilterRole;
  }): Promise<IUser[]> {
    const users = await this.repository.getList({ search, role });
    return users.map((user) => ({
      ...user,
      subjects: user.subjects.map((s) => ({ ...s.subject })),
      classes: user.classes.map((c) => ({ ...c.class })),
    }));
  }
}
