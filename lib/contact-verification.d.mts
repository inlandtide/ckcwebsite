import type { IncomingHttpHeaders } from "node:http";
import type { ContactRequest, ContactVerification } from "./contact-delivery.mjs";

export function createContactVerification(options?: {
  checkBotId?: (options: { advancedOptions: { checkLevel: "basic"; headers: IncomingHttpHeaders } }) => Promise<unknown>;
  timeoutMs?: number;
  logger?: Pick<Console, "info" | "error">;
}): (req: ContactRequest, reference: string) => Promise<ContactVerification>;
