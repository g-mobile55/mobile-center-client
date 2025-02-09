export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { bot } from "./activate/route";
import { webhookCallback, InlineKeyboard, Keyboard } from "grammy";

const webAppURI = process.env.WEB_APP_URI;

if (!webAppURI) throw new Error("Provide web app uri");

const webappBtn = new InlineKeyboard().webApp("Our web app", webAppURI);
const keyboard = new Keyboard().webApp("BTN", webAppURI).resized();

bot.command("start", async (ctx) => {
    try {
        await ctx.reply("WEB APP", { reply_markup: webappBtn });
    } catch (error) {
        console.log(error);
    }
});

bot.command("user", async (ctx) => {
    const chat = await ctx.getChat();
    const { has_private_forwards } = chat;
    console.log(has_private_forwards);
});

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

export const POST = webhookCallback(bot, "std/http");
