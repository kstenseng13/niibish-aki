import Image from 'next/image';

export default function ActionItemsSection() {
    return (
        <div>
            <div className="bg-salmonDark h-12"></div>
            <div id="callToAction" aria-live="polite" aria-label="Call to Action Section"></div>

            <div
                className="bg-[linear-gradient(to_bottom,rgba(255,170,115,0.7),rgba(255,216,110,0.95)),url('https://t3.ftcdn.net/jpg/05/15/15/96/360_F_515159692_TtVZ3MmYAQp4GVXjzMOTXpft7Owj9mnp.jpg')] productSection">
                <section className="m-16 bg-whiteSmoke productCard max-w-[20rem]" id="sustainabilityCard">
                    <a href="/sustainability"><Image width={320} height={240} className="productCardImage"
                        src="https://cdn.pixabay.com/photo/2021/08/23/18/37/tea-6568547_1280.jpg"
                        alt="mirkostoedter (Photographer).(2021, August 24). Tea, Organic, Pottery. Free for use [Digital]. Retrieved from URL https://pixabay.com/photos/tea-organic-pottery-green-healthy-6568547/"/>
                    </a>
                    <div className="mt-4 px-5 pb-5">
                        <a href="/sustainability">
                            <h5 className="text-2xl font-bold">Learn about sustainably harvested tea!</h5>
                        </a>
                        <div className="flex items-center justify-between">
                            <p>
                                <span className="text-lg">How we&apos;re making more than hot leaf juice.</span>
                            </p>
                        </div>
                    </div>
                </section>
                <section className="my-0 md:my-16 bg-whiteSmoke productCard max-w-[20rem]" id="seasonalSelectionsCard">
                    <a href="/menu"><Image width={320} height={240} className="productCardImage"
                        src="https://prtimes.jp/i/33644/32/resize/d33644-32-172195-0.jpg" alt="picture of various boba teas."/>
                    </a>
                    <div className="mt-4 px-5 pb-5">
                        <a href="/menu">
                            <h5 className="text-2xl font-bold">Seasonal Specialties</h5>
                        </a>
                        <div className="flex items-center justify-between">
                            <p>
                                <span className="text-lg">Our love for tea means we refresh our menu with new, seasonal
                                    specials.</span>
                            </p>
                        </div>
                    </div>
                </section>
                <section className="m-16 bg-whiteSmoke productCard max-w-[20rem]" id="eventsAndPromosCard">
                    <a href="/aboutUs"><Image width={320} height={240} className="productCardImage" src="https://uniquekiosk.com/wp-content/uploads/2021/03/281.jpg"
                        alt="[Bubble tea and coffee shop layout].(2021, March 8). 281-600x450 [Digital]. Retrieved from URL https://uniquekiosk.com/kiosk/creative-bubble-tea-store-display-furniture-coffee-shop-interior-design/"/>
                    </a>
                    <div className="mt-4 px-5 pb-5">
                        <a href="/aboutUs">
                            <h5 className="text-2xl font-bold">Events and Promotions</h5>
                        </a>
                        <div className="flex items-center justify-between">
                            <p>
                                <span className="text-lg">Check out our upcoming events and latest promotions and offers!</span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="bg-salmonDark h-12"></div>
        </div>
    );
};