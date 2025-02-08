import { wooAPI } from "@/lib/helpers/wooAPI";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
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
