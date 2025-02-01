import { NextRequest, NextResponse } from "next/server";
import { bot } from "../bot/route";
import Excel from "exceljs";
import path from "path";

type Country = {
    name: string;
    countryCode: string;
    capital: string;
    phoneIndicator: number;
};

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    console.log(data);
    try {
        const countries: Country[] = [
            { name: "Cameroon", capital: "Yaounde", countryCode: "CM", phoneIndicator: 237 },
            { name: "France", capital: "Paris", countryCode: "FR", phoneIndicator: 33 },
            {
                name: "United States",
                capital: "Washington, D.C.",
                countryCode: "US",
                phoneIndicator: 1,
            },
            { name: "India", capital: "New Delhi", countryCode: "IN", phoneIndicator: 91 },
            { name: "Brazil", capital: "Brasília", countryCode: "BR", phoneIndicator: 55 },
            { name: "Japan", capital: "Tokyo", countryCode: "JP", phoneIndicator: 81 },
            { name: "Australia", capital: "Canberra", countryCode: "AUS", phoneIndicator: 61 },
            { name: "Nigeria", capital: "Abuja", countryCode: "NG", phoneIndicator: 234 },
            { name: "Germany", capital: "Berlin", countryCode: "DE", phoneIndicator: 49 },
        ];

        const exportCountriesFile = async () => {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet("Countries List");

            worksheet.columns = [
                { key: "name", header: "Name" },
                { key: "countryCode", header: "Country Code" },
                { key: "capital", header: "Capital" },
                { key: "phoneIndicator", header: "International Direct Dialling" },
            ];

            countries.forEach((item) => {
                worksheet.addRow(item);
            });

            const exportPath = path.resolve(__dirname, "countries.xlsx");

            console.log("EXP Path", exportPath);
            await workbook.xlsx.writeFile("./countries.xlsx");
        };

        exportCountriesFile();
    } catch (error) {
        console.log(error);
    }

    try {
        await bot.api.sendMessage(data.user.id, "Your order has been successfully accepted.");
    } catch (error) {
        console.log(error);
    }
    return Response.json({ data: "All good." });
}
