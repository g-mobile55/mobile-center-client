import { NextRequest, NextResponse } from "next/server";
import { InputFile } from "grammy";
import { bot } from "../bot/activate/route";
import Excel from "exceljs";
import { ruMessage } from "@/lib/messages/ru";

const botMessages = ruMessage.bot;
const excelMessages = ruMessage.excel;

type Products = {
    name: string;
    for: string;
    color: string;
    quantity: number;
    brand: string;
    price: number;
    subtotal?: () => number;
};

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { user } = data;

    const products: Products[] = data.kart.map((product: any) => {
        // prettier-ignore
        return {
                brand: product.brands.map((brand: any) => brand.name).join("/"),
                name: product.name,
                color: product.attributes.filter((attribute: any) => attribute.name === "Color")[0]?.options,
                quantity: product.quantity,
                capacity:  product.attributes.filter((attribute: any) => attribute.name === "Capacity")[0]?.options,
                for:  product.attributes.filter((attribute: any) => attribute.name === "For Device")[0]?.options,
                price: product.price,
                subtotal: product.price * product.quantity,
            }
    });

    try {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Invoice");

        worksheet.columns = [
            { key: "brand", header: excelMessages.headers.Brand },
            { key: "name", header: excelMessages.headers.Name },
            { key: "for", header: excelMessages.headers.For },
            { key: "color", header: excelMessages.headers.Color },
            { key: "quantity", header: excelMessages.headers.Quantity },
            { key: "capacity", header: excelMessages.headers.Capacity },
            { key: "price", header: excelMessages.headers.Price },
            { key: "subtotal", header: excelMessages.headers.Subtotal },
        ];

        products.forEach((item) => {
            worksheet.addRow({ ...item, price: `${item.price}₽`, subtotal: `${item.subtotal}₽` });
        });

        const total = products.reduce((previousValue: number, currentValue: Products) => {
            // @ts-expect-error
            return previousValue + currentValue.subtotal;
        }, 0);

        worksheet.addRow({});
        worksheet.addRow({ price: excelMessages.headers.Total, subtotal: `${total}₽` });

        const fileBuffer = await workbook.xlsx.writeBuffer();
        const date = new Date();
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        const fileName = `invoice-${user.first_name}-${day}-${month}-${year}.xlsx`;

        // @ts-expect-error
        await bot.api.sendDocument(user.id, new InputFile(fileBuffer, fileName), {
            caption: botMessages.orderAccepted,
        });

        const chat = await bot.api.getChat(user.id);
        const { username, has_private_forwards, id, first_name } = chat;
        const messageToSend = botMessages.adminChat.msgIncomingInvoice(
            username,
            has_private_forwards,
            id,
            first_name
        );

        await bot.api.sendMessage(
            // @ts-expect-error
            process.env.MC_ADMIN_CHAT_ID,
            messageToSend,
            { parse_mode: "HTML" }
        );
        // prettier-ignore
        // @ts-expect-error
        await bot.api.sendDocument(process.env.MC_ADMIN_CHAT_ID, new InputFile(fileBuffer, fileName));
        return Response.json({ data: "All good." });
    } catch (error) {
        console.log(error);
        return Response.error();
    }
}
