

export default function ProductCard({ item }) {
    return (
        <section className="bg-whiteSmoke productCard" id="product">
            <a href="#">
                <img 
                    className="productCardImage"
                    src={item.imagePath} 
                    alt={item.altText} 
                />
            </a>
            <div className="mt-2 px-5 pb-3">
                <a href="#">
                    <h5 className="text-xl font-bold">{item.name}</h5>
                </a>
                <div className="flex items-center justify-between">
                    <p>
                        <span className="text-lg">{item.price}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
