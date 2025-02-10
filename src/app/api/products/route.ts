import { wooAPI } from "@/lib/helpers/wooAPI";
import { NextRequest } from "next/server";
import { REQUESTED_PRODUCTS_STATUS } from "@/lib/constants/constants";

export async function GET(request: NextRequest) {
    try {
        request.nextUrl.searchParams.append("status", REQUESTED_PRODUCTS_STATUS);

        const url = `products/?${request.nextUrl.searchParams.toString()}`;

        const response = await wooAPI.get(url);

        return Response.json(response.data);
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}

export async function OPTIONS() {
    Response.json({ data: "OK" });
}
