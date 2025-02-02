import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const wooAPI = new WooCommerceRestApi({
    url: process.env.WP_API_URL!,
    consumerKey: process.env.WOO_CONSUMER_KEY!,
    consumerSecret: process.env.WOO_CONSUMER_SECRET!,
    version: "wc/v3",
});
