import { wooAPI } from "@/lib/helpers/wooAPI";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productID: string }> }
) {
    try {
        const { productID } = await params;
        const { data: variations } = await wooAPI.get(
            `products/${productID}/variations/?per_page=100`
        );

        return Response.json(variations);
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
