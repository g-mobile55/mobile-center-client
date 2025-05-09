import { wooAPI } from "@/lib/helpers/wooAPI";

export async function GET() {
    try {
        const [{ data: brands }, { data: attributes }, { data: categories }] = await Promise.all([
            wooAPI.get("products/brands/?per_page=100"),
            wooAPI.get("products/attributes"),
            wooAPI.get("products/categories/?per_page=100"),
        ]);

        const terms = await Promise.all(
            attributes.map((attribute: any) => {
                return wooAPI.get(`products/attributes/${attribute.id}/terms/?per_page=100`);
            })
        );

        const attributesTerms = attributes.map((attribute: any, index: number) => {
            return {
                parentAttribute: attribute.slug,
                parentAttributeName: attribute.name,
                terms: terms[index].data,
            };
        });

        return Response.json({ brands, categories, attributesTerms });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
