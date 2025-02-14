import { wooAPI } from "@/lib/helpers/wooAPI";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productID: string }> }
) {
    try {
        const { productID } = await params;
        const { data: product } = await wooAPI.get(`products/${productID}`);

        return Response.json(product);
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
