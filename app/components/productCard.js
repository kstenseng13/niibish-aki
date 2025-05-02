import Image from "next/image";
import { memo, useMemo } from "react";

function ProductCard({ item, onClick }) {
    const price = useMemo(() => {
        return typeof item.price === "object" && "$numberDecimal" in item.price
            ? parseFloat(item.price.$numberDecimal)
            : item.price;
    }, [item.price]);

    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
    };

    return (
        <div
            className="bg-whiteSmoke productCard m-1 md:m-4 max-w-[12rem] md:max-w-[16rem] cursor-pointer"
            id="product"
            onClick={handleClick}
            role="button"
            aria-label={`View details for ${item.name}`}
        >
            <div className="relative h-[12rem] md:h-[18rem] rounded-t-lg overflow-hidden">
                <Image
                    src={`/images/menu/${item.image}`}
                    alt={item.alt || item.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 12rem, 16rem"
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

export default memo(ProductCard);
