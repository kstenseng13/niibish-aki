

export default function OrderItem({ orderItem }) {
    return (
        <section className="m-2 lg:mt-8 lg:mx-12 ml-0 border border-stone-800 flex flex-wrap" id="orderSummaryItem">
            <div className="m-2 lg:m-4 lg:m-6 inline-block align-top">
                <img 
                    className="bg-cover w-28 h-28 lg:w-36 lg:h-36"
                    src={orderItem.imagePath} 
                    alt={orderItem.altText} 
                />
            </div>
            <div className="inline-block ml-0 m-6 w-auto grow">
                <div className="flex flex-nowrap">
                    <div className="grow">
                        <span className="text-lg xl:text-3xl font-semibold">{orderItem.name}</span>
                    </div>
                    <div className="grow pt-1">
                        <button type="button" className="float-right align-top">
                            <img src="../components/x.svg" alt="Delete item" className="w-4 h-4 lg:w-6 lg:h-6" />
                            <span className="sr-only">Delete item</span>
                        </button>
                    </div>
                </div>
                <div className="w-full flex flex-nowrap">
                    <div className="grow">
                        <p>Medium</p>
                        <ul className="list-inside list-disc">
                            {orderItem.addIns.map((addIn, index) => (
                                <li key={index}>{addIn}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="grow text-right">
                        <p>$ {orderItem.price.toFixed(2)}</p>
                        {orderItem.extraCharges.map((charge, index) => (
                            <p key={index}>+ {charge.toFixed(2)}</p>
                        ))}
                        <p className="font-semibold text-xl">$ {orderItem.totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
