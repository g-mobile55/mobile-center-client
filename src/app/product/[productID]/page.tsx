function page({ params }: { params: { productID: string } }) {
    return <div>page: {params.productID}</div>;
}

export default page;
