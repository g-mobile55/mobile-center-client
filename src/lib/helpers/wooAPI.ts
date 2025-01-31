import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const wooAPI = new WooCommerceRestApi({
    url: "http://mobile-center.gg",
    consumerKey: process.env.WOO_CONSUMER_KEY!,
    consumerSecret: process.env.WOO_CONSUMER_SECRET!,
    version: "wc/v3",
});
