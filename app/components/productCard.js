import Image from "next/image";

export default function ProductCard({ item, onClick }) {
    const price =
        typeof item.price === "object" && "$numberDecimal" in item.price
            ? parseFloat(item.price.$numberDecimal)
            : item.price;

    return (
        <div className="bg-whiteSmoke productCard m-1 md:m-4 max-w-[12rem] md:max-w-[16rem] cursor-pointer" id="product"
            onClick={() => onClick?.(item)} role="button">
            <div className="relative h-[12rem] md:h-[18rem] rounded-t-lg overflow-hidden">
                <Image
                    src={`/images/menu/${item.image}`}
                    alt={item.alt || item.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="productCardImage"
                />
            </div>
            <div className="mt-2 px-5 pb-3">
                <h5 className="text-xl font-bold">{item.name}</h5>
                <div className="flex items-center justify-between">
                    <p>
                        <span className="text-lg">${price.toFixed(2)}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
