import { proxyWebhooks } from "~/server/webhooks";
async function handle(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyWebhooks(request, (await params).path);
}
export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
