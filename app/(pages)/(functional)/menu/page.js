//TODO: USE INTERCEPTING ROUTES???: https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes

export default function Menu() {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap items-center justify-between mb-4">
                <form className="flex-1 lg:mr-12 basis-1/2">
                </form>
                <div className="float-right">
                    <div className="py-2 px-2">
                        <nav className="flex flex-wrap gap-4">
                            <a href="#" data-target="#top"
                                className="tab-btn whitespace-nowrap inline-flex rounded-lg py-2 px-2 hover:bg-amber-300">Signature</a>
                            <a href="#" data-target="#seasonal"
                                className="tab-btn whitespace-nowrap inline-flex rounded-lg py-2 px-2 hover:bg-amber-300">Seasonal</a>
                            <a href="#" data-target="#milkTea"
                                className="tab-btn whitespace-nowrap inline-flex rounded-lg py-2 px-2 hover:bg-amber-300">Milk Tea</a>
                            <a href="#" data-target="#fruitTea"
                                className="tab-btn whitespace-nowrap inline-flex rounded-lg py-2 px-2 hover:bg-amber-300">Fruit Teas</a>
                            <a href="#" data-target="#snacks"
                                className="tab-btn whitespace-nowrap inline-flex rounded-lg py-2 px-2 hover:bg-amber-300">Snacks</a>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white mb-4 rounded-lg shadow-md">
                {["signature", "seasonal", "milkTea", "fruitTea", "snacks"].map((category) => (
                    <div key={category} id={category}>
                        <h1 className="mt-4 text-center" aria-labelledby={`${category}-heading`}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h1>
                        <div id={`${category}Section`} className="productSection" aria-live="polite"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
