import { LogStatus } from "@prisma/client";

export interface ISendMailResponse {
  id: number;
  templateId: string;
  userId: string;
  status: LogStatus;
  createdAt: Date;
  updatedAt: Date;
}
