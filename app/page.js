import Image from "next/image";
import RegisterForm from "./components/register";

export default function Home() {
    return (
        <div>
            <header
                className="bg-no-repeat bg-right bg-cover 2xl:bg-bottom bg-[url('https://cdn.pixabay.com/photo/2020/08/12/01/06/forest-5481346_1280.jpg')] w-full" alt="PUT CREDS.">
                <div className="displayHeader text-yellow-50 headerSizing  bg-gradient-to-r from-stone-900/80">
                    <span>Boozhoo! Mino-niibishaaboo na?</span>
                    <div className="displayHeaderSub">
                        <span>Hello! Would you like good tea?</span>
                    </div>
                </div>
            </header>
            <div className="bg-matchaDark h-12 w-full"></div>

            <section id="joinRewardsSection"
                className="bg-[linear-gradient(to_right_bottom,rgba(202,211,156,0.9),rgba(244,246,244,0.9)),url('https://www.creativefabrica.com/wp-content/uploads/2023/02/26/Wildflowers-Of-The-Pacific-Northwest-Digital-Graphic-62492445-1.png')] p-16 flex flex-wrap justify-center"
                alt="ADD CREDS">
                <div className="text-center align-top pb-16 shrink lg:mr-16">
                    <div>
                        <span className="text-5xl font-bold">a free drink is steps away</span>
                    </div>
                    <div className="pt-8">
                        <span className="text-2xl font-semibold">sign up for Leaf Rewards and get one after your first
                            purchase</span>
                    </div>
                </div>
                <RegisterForm/>

            </section>
            <div className="bg-salmonDark h-12">
            </div>
            <div id="callToAction" aria-live="polite" aria-label="Call to Action Section"></div>

            <div alt="ADD CREDS"
                className="bg-[linear-gradient(to_bottom,rgba(255,170,115,0.7),rgba(255,216,110,0.95)),url('https://t3.ftcdn.net/jpg/05/15/15/96/360_F_515159692_TtVZ3MmYAQp4GVXjzMOTXpft7Owj9mnp.jpg')] productSection">
                <section className="m-16 bg-whiteSmoke productCard" id="sustainabilityCard">
                    <a href="#"><img className="productCardImage"
                        src="https://cdn.pixabay.com/photo/2021/08/23/18/37/tea-6568547_1280.jpg"
                        alt="mirkostoedter (Photographer).(2021, August 24). Tea, Organic, Pottery. Free for use [Digital]. Retrieved from URL https://pixabay.com/photos/tea-organic-pottery-green-healthy-6568547/"></img>
                    </a>
                    <div className="mt-4 px-5 pb-5">
                        <a href="#">
                            <h5 className="text-2xl font-bold">Learn about sustainably harvested tea!</h5>
                        </a>
                        <div className="flex items-center justify-between">
                            <p>
                                <span className="text-lg">How we&apos;re making more than hot leaf juice.</span>
                            </p>
                        </div>
                    </div>
                </section>
                <section className="my-0 md:my-16 bg-whiteSmoke productCard" id="seasonalSelectionsCard">
                    <a href="#"><img className="productCardImage"
                        src="https://prtimes.jp/i/33644/32/resize/d33644-32-172195-0.jpg"></img>
                    </a>
                    <div className="mt-4 px-5 pb-5">
                        <a href="#">
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
                <section className="m-16 bg-whiteSmoke productCard" id="eventsAndPromosCard">
                    <a href="#"><img className="productCardImage" src="https://uniquekiosk.com/wp-content/uploads/2021/03/281.jpg"
                        alt="[Bubble tea and coffee shop layout].(2021, March 8). 281-600x450 [Digital]. Retrieved from URL https://uniquekiosk.com/kiosk/creative-bubble-tea-store-display-furniture-coffee-shop-interior-design/"></img>
                    </a>
                    <div className="mt-4 px-5 pb-5">
                        <a href="#">
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
            <div id="footer" className="text-center lg:text-left bg-matcha"></div>
        </div>
    );
}
