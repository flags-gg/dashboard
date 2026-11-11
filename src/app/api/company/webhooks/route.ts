import { proxyWebhooks } from "~/server/webhooks";
export const GET = (request: Request) => proxyWebhooks(request);
export const POST = (request: Request) => proxyWebhooks(request);
