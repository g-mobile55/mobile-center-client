export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { bot } from "./activate/route";
import { webhookCallback, InlineKeyboard, Keyboard } from "grammy";
import { wooAPI } from "@/lib/helpers/wooAPI";
import fs from "fs/promises";
import util from "util";
import Excel from "exceljs";
import { wcMAP } from "@/lib/maps/wcValueToIdMap";

const webAppURI = process.env.WEB_APP_URI;

if (!webAppURI) throw new Error("Provide web app uri");

const webappBtn = new InlineKeyboard().webApp("ONLINE STORE", webAppURI);
const keyboard = new Keyboard().webApp("BTN", webAppURI).resized();

type PruductTocreateT = {
    name: string;
    status: "draft" | "pending" | "private" | "publish";
    type: "simple" | "grouped" | "external" | "variable";
    regular_price: string;
    manage_stock?: boolean;
    stock_quantity?: string | undefined;
    stock_status: "instock" | "outofstock" | "onbackorder";
    categories: { id: number }[];
    brands: { id: number }[];
    attributes: {
        id: number;
        options: string[];
    }[];
};

type ProductFromExcel = {
    Group: string;
    Brands: keyof typeof wcMAP.brands;
    Name: string;
    "Regular Price": string;
    Categories: keyof typeof wcMAP.categories;
    Material: keyof typeof wcMAP.attributes.Material.options;
    "For Device": keyof (typeof wcMAP.attributes)["For Device"]["options"];
    Color: keyof typeof wcMAP.attributes.Color.options;
    "Stock Quantity": string | undefined;
    "Min Price": string;
    SKU: string | undefined;
};

console.log("NODE ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
    await bot.api.setMyCommands([
        { command: "start", description: "GET online store button." },
        { command: "map_json", description: "GET mapped data." },
    ]);
} else {
    await bot.api.setMyCommands([{ command: "start", description: "GET online store button." }]);
}

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

bot.command("map_json", async (ctx) => {
    try {
        const [{ data: brands }, { data: attributes }, { data: categories }] = await Promise.all([
            wooAPI.get("products/brands/?per_page=100"),
            wooAPI.get("products/attributes"),
            wooAPI.get("products/categories/?per_page=100"),
        ]);

        const terms = await Promise.all(
            attributes.map((attribute: any) => {
                return wooAPI.get(`products/attributes/${attribute.id}/terms?per_page=100`);
            })
        );

        const brandsData = brands.map((brand: any) => {
            return {
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                description: brand.description,
                menu_order: brand["menu_order"],
                count: brand.count,
            };
        });

        const categoriesData = categories.map((category: any) => {
            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                menu_order: category["menu_order"],
                count: category.count,
            };
        });

        const attributesData = {};

        for (let i = 0; i < attributes.length; i++) {
            attributesData[attributes[i].name] = {
                self: {
                    id: attributes[i].id,
                    name: attributes[i].name,
                    slug: attributes[i].slug,
                },
                terms: terms[i].data.map((term: any) => {
                    return {
                        id: term.id,
                        name: term.name,
                        slug: term.slug,
                        description: term.description,
                        menu_order: term["menu_order"],
                        count: term.count,
                    };
                }),
            };
        }

        const makeOpj = (arr: []) => {
            const obj = {};

            arr.forEach((item) => {
                obj[item.name] = item.id;
            });

            return obj;
        };

        const makeOpjAtr = (atrData) => {
            const keys = Object.keys(atrData);
            const obj = {};

            keys.forEach((key) => {
                obj[key] = {
                    self: atrData[key].self.id,
                    options: makeOpj(atrData[key].terms),
                };
            });

            return obj;
        };

        // creating constant map
        const map = {
            brands: makeOpj(brandsData),
            categories: makeOpj(categoriesData),
            attributes: makeOpjAtr(attributesData),
        };

        const dataToWrite = {
            brands: brandsData,
            categories: categoriesData,
            attributes: attributesData,
            map,
        };

        // console.log(
        //     util.inspect(dataToWrite, { showHidden: false, depth: null, colors: true })
        // );

        await fs.writeFile("./maps.json", JSON.stringify(dataToWrite, null, 4));
    } catch (error) {
        console.log(error);
    }
});

bot.command("create_product", async (ctx) => {
    try {
        const productToCreate = {
            name: "AirSpace Case",
            status: "draft",
            type: "variable",
            regular_price: "560",
            manage_stock: true,
            stock_quantity: "20",
            stock_status: "instock",
            categories: [{ id: 17 }],
            brands: [{ id: 23 }],
            attributes: [
                {
                    id: undefined,
                    options: ["Black"],
                },
            ],
        };

        const response = await wooAPI.post("products", productToCreate);
    } catch (error) {
        console.log(util.inspect(error, { showHidden: false, depth: null, colors: true }));
        console.log(error);
    }
});

bot.command("import", async (ctx) => {
    try {
        //
        const workBook = new Excel.Workbook();

        await workBook.xlsx.readFile("./imports/chargers-holders-cables.xlsx");

        const jsonData: object[] = [];
        workBook.worksheets.forEach(function (sheet) {
            // read first row as data keys
            const firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;
            const keys = firstRow.values;
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber == 1) return;
                const values = row.values;
                const obj: { [key: string]: string } = {};
                // @ts-expect-error
                for (let i = 1; i < keys.length; i++) {
                    // @ts-expect-error
                    obj[keys[i]] = values[i];
                }
                jsonData.push(obj);
            });
        });

        const productsToCreate: PruductTocreateT[] = [];

        for (const product of jsonData.slice(0, 16) as ProductFromExcel[]) {
            const productToCreate: PruductTocreateT = {
                name: product.Name.trim(),
                status: "draft",
                type: "variable",
                regular_price: product["Regular Price"],
                manage_stock: true,
                stock_quantity: "10",
                stock_status: "instock",
                brands: [{ id: wcMAP.brands[product.Brands] }],
                categories: product.Categories.split(";").map((category) => {
                    return { id: wcMAP.categories[category.trim()] };
                }),
                attributes: [
                    ...Object.keys(wcMAP.attributes)
                        .filter((key) => product[key])
                        .map((key) => ({
                            id: wcMAP.attributes[key].self,
                            visible: true,
                            variation: true,
                            options: product[key].split(",").map((str: string) => str.trim()),
                        })),
                ],
            };
            productsToCreate.push(productToCreate);
        }

        const index = 46;
        // console.log(jsonData[index], productsToCreate[index], productsToCreate[index].attributes);
        // await wooAPI.post("products/batch", { create: productsToCreate });
        // {
        //     Group: 'Camera lens',
        //     Brands: 'KEEPHONE',
        //     Name: ' CALVIN CAMERA LENS ',
        //     'Regular Price': '300,00',
        //     Categories: 'Camera Protector',
        //     Material: undefined,
        //     'For Device': 'IP 15, 15 PLUS',
        //     Color: 'Black, Light Blue, Light Green, Light yellow, Pink',
        //     'Stock Quantity': undefined,
        //     'Min Price': '15,00',
        //     SKU: undefined
        //   },
    } catch (error) {
        // console.log(util.inspect(error, { showHidden: false, depth: null, colors: true }));
        console.log(error);
    }
});

export const POST = webhookCallback(bot, "std/http");
