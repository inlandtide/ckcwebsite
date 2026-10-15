import type { IncomingMessage, ServerResponse } from "node:http";

export interface ContactLead {
  name: string;
  email: string;
  phone: string;
  message: string;
  attribution: Record<string, string>;
}

export type ContactRequest = IncomingMessage & { body?: unknown };
export type Delivery = {
  sendNotification: (lead: ContactLead, reference: string, sheetsFailed?: boolean) => Promise<boolean>;
  saveToSheets: (lead: ContactLead, reference: string) => Promise<boolean>;
};

export function createContactDelivery(options?: { fetch?: typeof fetch; env?: NodeJS.ProcessEnv; logger?: Pick<Console, "info" | "error"> }): Delivery;
export function createContactHandler(options: Delivery & {
  waitUntil: (promise: Promise<unknown>) => unknown;
  logger?: Pick<Console, "info" | "error">;
  newReference?: () => string;
}): (req: ContactRequest, res: ServerResponse) => Promise<void>;
