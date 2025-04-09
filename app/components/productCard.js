import Image from "next/image";

export default function ProductCard({ item }) {
    const price =
        typeof item.price === "object" && "$numberDecimal" in item.price
            ? item.price.$numberDecimal
            : item.price;

            const productUrl = `/product/${item._id}`;

    return (
        <section className="bg-whiteSmoke productCard m-1 md:m-4 max-w-[12rem] md:max-w-[16rem]" id="product">
            <a href="#">
                <div className="relative h-[12rem] md:h-[18rem] rounded-t-lg overflow-hidden">
                    <Image
                        src={`/images/menu/${item.image}`}
                        alt={item.alt || item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="productCardImage"
                    />
                </div>
            </a>
            <div className="mt-2 px-5 pb-3">
                <a>
                    <h5 className="text-xl font-bold">{item.name}</h5>
                </a>
                <div className="flex items-center justify-between">
                    <p>
                        <span className="text-lg">${price}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
