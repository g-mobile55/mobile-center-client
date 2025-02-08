import { bot } from "../route";

export async function GET() {
    bot.api.setWebhook(`${process.env.WEB_APP_URI}/api/bot`, {
        drop_pending_updates: true,
    });
}
