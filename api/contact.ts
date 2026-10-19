import { waitUntil } from "@vercel/functions";
import { checkBotId } from "botid/server";
import { createContactDelivery, createContactHandler } from "../lib/contact-delivery.mjs";
import { createContactVerification } from "../lib/contact-verification.mjs";

export default createContactHandler({
  ...createContactDelivery(),
  verifyRequest: createContactVerification({ checkBotId }),
  waitUntil,
});
