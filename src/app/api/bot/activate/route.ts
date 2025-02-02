import { bot } from "../route";

export async function GET() {
    bot.api.setWebhook(`${process.env.webAppURI}/api/bot`, {
        drop_pending_updates: true,
    });
}
