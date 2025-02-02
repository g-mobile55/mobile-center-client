import { NextRequest, NextResponse } from "next/server";
import { InputFile } from "grammy";
import { bot } from "../bot/route";
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

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();

    console.log(data.kart[0].attributes[2]);

    const products: Products[] = data.kart.map((product: any) => {
        // prettier-ignore
        return {
                name: product.name,
                color: product.attributes.filter((attribute: any) => attribute.name === "Color")[0]?.options,
                quantity: product.quantity,
                brand: product.brands.map((brand: any) => brand.name).join("/"),
                for:  product.attributes.filter((attribute: any) => attribute.name === "Phone Brand")[0]?.options,
                price: product.price,
                subtotal: product.price * product.quantity
            }
    });

    try {
        const exportCountriesFile = async () => {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet("Countries List");

            worksheet.columns = [
                { key: "name", header: "Name" },
                { key: "for", header: "For" },
                { key: "color", header: "Color" },
                { key: "quantity", header: "Quantity" },
                { key: "brand", header: "Brand" },
                { key: "price", header: "Price" },
                { key: "subtotal", header: "Subtotal" },
                { key: "total", header: "Total" },
            ];

            products.forEach((item) => {
                worksheet.addRow(item);
            });

            const total = products.reduce((previousValue: number, currentValue: Products) => {
                // @ts-expect-error
                return previousValue + currentValue.subtotal;
            }, 0);

            worksheet.addRow({ total: total });

            const fileBuffer = await workbook.xlsx.writeBuffer();
            const date = new Date();
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();

            const fileName = `invoice-${data.user.first_name}-${day}/${month}/${year}.xlsx`;

            await bot.api.sendMessage(data.user.id, "Your order is accepted.");
            // @ts-expect-error
            await bot.api.sendDocument(data.user.id, new InputFile(fileBuffer, fileName));
            // @ts-expect-error
            // prettier-ignore
            await bot.api.sendMessage(process.env.MC_ADMIN_CHAT_ID, `We have a new order from the user ${data.user.first_name}`)
            // prettier-ignore
            // @ts-expect-error
            await bot.api.sendDocument(process.env.MC_ADMIN_CHAT_ID, new InputFile(fileBuffer, fileName));

            // await ctx.replyWithDocument({
            //     source: buffer,  // This is the file buffer
            //     filename: 'example.xlsx',  // Optionally, set the filename
            // });

            // await workbook.xlsx.writeFile("./countries.xlsx");
        };

        exportCountriesFile();
    } catch (error) {
        console.log(error);
    }

    try {
        // await bot.api.sendMessage(data.user.id, "Your order has been successfully accepted.");
    } catch (error) {
        console.log(error);
    }
    return Response.json({ data: "All good." });
}
