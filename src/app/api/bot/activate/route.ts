import { Bot } from "grammy";

export const token = process.env.bot_token;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

export const bot = new Bot(token);

export async function GET() {
    try {
        await bot.api.setWebhook(`${process.env.WEB_APP_URI}/api/bot`, {
            drop_pending_updates: true,
        });
        return Response.json({ message: "Bot is activated." });
    } catch (error) {
        console.log(error);
        return Response.json(error);
    }
}
