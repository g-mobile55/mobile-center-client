import { wooAPI } from "@/lib/helpers/wooAPI";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productID: string; variationID: string }> }
) {
    try {
        const { productID, variationID } = await params;
        console.log(variationID);
        const { data: variation } = await wooAPI.get(
            `products/${productID}/variations/${variationID}`
        );

        return Response.json(variation);
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
