import { NextRequest, NextResponse } from "next/server";
import { InputFile } from "grammy";
import { bot } from "../bot/activate/route";
import Excel from "exceljs";

type Products = {
    name: string;
    for: string;
    color: string;
    quantity: number;
    brand: string;
    price: number;
    subtotal?: () => number;
};

const createMessage = (
    username: string | undefined,
    has_private_forwards: true | undefined,
    id: number,
    first_name = ""
) => {
    if (username) {
        return `🤑 We have a new order from the user <a href="https://t.me/${username}">${first_name}</a>`;
    }
    if (!username && !has_private_forwards) {
        return `🤑 We have a new order from the user <a href="tg://user?id=${id}">${first_name}</a>`;
    }

    return "🤑 We have a new order, users privacy 🥷🏻 settings do not allow to share they're profile.";
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
            { key: "brand", header: "Brand" },
            { key: "name", header: "Name" },
            { key: "for", header: "For" },
            { key: "color", header: "Color" },
            { key: "quantity", header: "Quantity" },
            { key: "capacity", header: "Capacity" },
            { key: "price", header: "Price" },
            { key: "subtotal", header: "Subtotal" },
        ];

        products.forEach((item) => {
            worksheet.addRow({ ...item, price: `${item.price}₽`, subtotal: `${item.subtotal}₽` });
        });

        const total = products.reduce((previousValue: number, currentValue: Products) => {
            // @ts-expect-error
            return previousValue + currentValue.subtotal;
        }, 0);

        worksheet.addRow({});
        worksheet.addRow({ price: "Total", subtotal: `${total}₽` });

        const fileBuffer = await workbook.xlsx.writeBuffer();
        const date = new Date();
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();

        const fileName = `invoice-${user.first_name}-${day}-${month}-${year}.xlsx`;

        // @ts-expect-error
        await bot.api.sendDocument(user.id, new InputFile(fileBuffer, fileName), {
            caption: "🎉Your order is accepted.🎉",
        });

        const chat = await bot.api.getChat(user.id);
        const { username, has_private_forwards, id, first_name } = chat;
        const messageToSend = createMessage(username, has_private_forwards, id, first_name);

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
