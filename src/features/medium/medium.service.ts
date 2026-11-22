import "server-only";

import { MediumRepository } from "./medium.repository";
import { IQueryParams } from "@/lib/filter";
import { IMediumListItem, IMediumOption } from "./medium.types";
import { mediumSchema } from "./medium.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { invalidDataProvidedError, recordInUseError } from "@/lib/orpc/errors";
import { mediumIdRequiredError, mediumNameExistsError, mediumNotFoundError } from "./medium.errors";
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
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.create({
        name: parsedData.data.name.trim(),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new mediumNameExistsError();
        }
      }
      throw error;
    }
  }

  async update(mediumId: string, data: z.infer<typeof mediumSchema>) {
    if (!mediumId) throw new mediumIdRequiredError();

    const parsedData = mediumSchema.safeParse(data);
    if (!parsedData.success) {
      throw new invalidDataProvidedError();
    }

    try {
      await this.repository.update(mediumId, {
        name: parsedData.data.name.trim(),
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new mediumNameExistsError();
        }
        if (error.code === "P2025") {
          throw new mediumNotFoundError();
        }
      }
      throw error;
    }
  }

  async delete(mediumId: string) {
    if (!mediumId) throw new mediumIdRequiredError();

    const medium = await this.repository.getRelations(mediumId);
    if (!medium) throw new mediumNotFoundError();

    const hasRelations = medium.classSubjects.length > 0 || medium.enrollmentSubjects.length > 0;

    if (hasRelations) {
      throw new recordInUseError();
    }

    try {
      await this.repository.delete(mediumId);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new mediumNotFoundError();
        }
        if (error.code === "P2003") {
          throw new recordInUseError();
        }
      }
      throw error;
    }
  }
}
