import { BatchRepository } from "./batch.repository";
import { BatchService } from "./batch.service";

export const batchRepository = new BatchRepository();
export const batchService = new BatchService(batchRepository);
export * from "./batch.types";
