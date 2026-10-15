import { waitUntil } from "@vercel/functions";
import { createContactDelivery, createContactHandler } from "../lib/contact-delivery.mjs";

export default createContactHandler({ ...createContactDelivery(), waitUntil });
