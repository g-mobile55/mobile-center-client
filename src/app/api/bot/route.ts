export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { Bot, webhookCallback, InlineKeyboard, Keyboard } from "grammy";

export const token = process.env.bot_token;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

export const bot = new Bot(token);

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));

const webappBtn = new InlineKeyboard().webApp(
    "Our web app",
    "https://vsn5nrl9-3000.euw.devtunnels.ms/"
);

const keyboard = new Keyboard().webApp("BTN", "https://vsn5nrl9-3000.euw.devtunnels.ms/").resized();

bot.command("inline", async (ctx) => {
    try {
        await ctx.reply("WEB APP", { reply_markup: webappBtn });
    } catch (error) {
        console.log(error);
    }
});

bot.command("keyboard", async (ctx) => {
    try {
        await ctx.reply("WEB APP", {
            reply_markup: keyboard,
        });
    } catch (error) {
        console.log(error);
    }
});

bot.api.setWebhook("https://vsn5nrl9-3000.euw.devtunnels.ms/api/bot", {
    drop_pending_updates: true,
});

export const POST = webhookCallback(bot, "std/http");
