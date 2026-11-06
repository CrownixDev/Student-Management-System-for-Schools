import "server-only";

import { MediumRepository } from "./medium.repository";
import { IQueryParams } from "@/lib/filter";
import { IMediumListItem, IMediumOption } from "./medium.types";
import { mediumSchema } from "./medium.schema";
import { ApiErrorV2 } from "@/lib/ApiError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import z from "zod";

export class MediumService {
  constructor(private repository: MediumRepository) {}

  async getList({ search }: Pick<IQueryParams, "search">): Promise<IMediumListItem[]> {
    return await this.repository.getList({ search });
  }

  async getAsOptions(): Promise<IMediumOption[]> {
    const mediumList = await this.repository.getList({});
    return mediumList.map((medium) => ({ value: medium.id, label: medium.name }));
  }

  async create(data: z.infer<typeof mediumSchema>) {
    const parsedData = mediumSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.create({
        name: parsedData.data.name.trim(),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Medium name is already exists");
        }
      }
      throw error;
    }
  }

  async update(mediumId: string, data: z.infer<typeof mediumSchema>) {
    if (!mediumId) throw new ApiErrorV2("Medium id is required");

    const parsedData = mediumSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ApiErrorV2("Data validation failed");
    }

    try {
      await this.repository.update(mediumId, {
        name: parsedData.data.name.trim(),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ApiErrorV2("Medium name is already exists");
        }
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
      }
      throw error;
    }
  }

  async delete(mediumId: string) {
    if (!mediumId) throw new ApiErrorV2("Medium id is required");

    const medium = await this.repository.getRelations(mediumId);
    if (!medium) throw new ApiErrorV2("medium not found");

    const hasRelations = medium.classSubjects.length > 0 || medium.enrollmentSubjects.length > 0;

    if (hasRelations) {
      throw new ApiErrorV2("This medium is currently in use");
    }

    try {
      await this.repository.delete(mediumId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new ApiErrorV2("Record not found");
        }
        if (error.code === "P2003") {
          throw new ApiErrorV2("This medium is currently in use");
        }
      }
      throw error;
    }
  }
}
