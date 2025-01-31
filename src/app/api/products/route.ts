import { wooAPI } from "@/lib/helpers/wooAPI";

export async function GET() {
    try {
        const [{ data: brands }, { data: attributes }, { data: categories }] = await Promise.all([
            wooAPI.get("products/brands"),
            wooAPI.get("products/attributes"),
            wooAPI.get("products/categories"),
        ]);

        const terms = await Promise.all(
            attributes.map((attribute: any) => {
                return wooAPI.get(`products/attributes/${attribute.id}/terms`);
            })
        );

        const attributesTerms = attributes.map((attribute: any, index: number) => {
            return { parrentAttribute: attribute.slug, terms: terms[index].data };
        });

        console.log(attributesTerms);
        console.log(attributes);
        return Response.json({ brands, categories, attributesTerms });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}
