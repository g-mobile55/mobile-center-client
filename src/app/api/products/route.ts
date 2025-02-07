import { wooAPI } from "@/lib/helpers/wooAPI";

type SParamsT = {
    brand: string | undefined;
    category: string | undefined;
    attribute: string | string[] | undefined;
    attribute_term: string | string[] | undefined;
    page: string | undefined;
};

export async function GET({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    try {
        // const sParams = (await searchParams) as SParamsT;

        console.log("PARAMS", searchParams);

        // const urlSearchParams = new URLSearchParams();

        // if (sParams.brand) urlSearchParams.append("brand", sParams.brand);

        // if (sParams.category) urlSearchParams.append("category", sParams.category);

        // if (sParams.attribute && sParams.attribute_term) {
        //     if (
        //         typeof sParams.attribute === "string" &&
        //         typeof sParams.attribute_term === "string"
        //     ) {
        //         urlSearchParams.append("attribute", sParams.attribute);
        //         urlSearchParams.append("attribute_term", sParams.attribute_term);
        //     } else {
        //         for (let i = 0; i < sParams.attribute.length; i++) {
        //             urlSearchParams.append("attribute", sParams.attribute[i]);
        //             urlSearchParams.append("attribute_term", sParams.attribute_term[i]);
        //         }
        //     }
        // }

        // if (sParams.page) {
        //     urlSearchParams.append("page", sParams.page + 1);
        // }

        // urlSearchParams.append("per_page", "2");

        // const url = `products/?${urlSearchParams.toString()}`;

        // const response = await wooAPI.get(url);

        return Response.json({ data: "OK" });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}

export async function OPTIONS() {
    Response.json({ data: "OK" });
}
