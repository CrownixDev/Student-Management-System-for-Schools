import { MediumService } from "./medium.service";
import { MediumRepository } from "./medium.repository";

export * from "./medium.types";
export const mediumRepository = new MediumRepository();
export const mediumService = new MediumService(mediumRepository);
