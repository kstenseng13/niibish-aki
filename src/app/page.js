import Image from "next/image";

export default function Home() {
    return (
        <div className="">

            <header
                className="bg-no-repeat bg-right bg-cover 2xl:bg-bottom bg-[url('https://cdn.pixabay.com/photo/2020/08/12/01/06/forest-5481346_1280.jpg')] w-full" alt="PUT CREDS.">
                <div className="displayHeader text-yellow-50 headerSizing  bg-gradient-to-r from-stone-900/80">
                    <span>Boozhoo! Mino-niibiishaaboo na?</span>
                    <div className="displayHeaderSub">
                        <span>Hello! Would you like good tea?</span>
                    </div>
                </div>
            </header>
            <div className="bg-skyBlue h-12 w-full"></div>

            <section id="joinRewardsSection"
                className="bg-[linear-gradient(to_right_bottom,rgba(202,211,156,0.9),rgba(244,246,244,0.9)),url('https://www.creativefabrica.com/wp-content/uploads/2023/02/26/Wildflowers-Of-The-Pacific-Northwest-Digital-Graphic-62492445-1.png')] p-16 flex flex-wrap justify-center"
                alt="ADD CREDS">
                <div className="text-center align-top pb-16 shrink lg:mr-16">
                    <div>
                        <span className="text-5xl font-bold">a free drink is steps away</span>
                    </div>
                    <div className="pt-8">
                        <span className="text-2xl font-semibold">sign up for Dragon Rewards and get one after your first
                            purchase</span>
                    </div>
                </div>
                <div className="shrink basis-3/4 lg:basis-1/3">
                    <form aria-labelledby="register">
                        <div>
                            <div className="inline-block mb-5 w-full xl:w-[49%]">
                                <label htmlFor="firstName" className="block mb-2 text-sm font-medium">First</label>
                                <input type="text" id="firstName" name="firstName" className="p-2.5" placeholder="Jane" required aria-required="true"></input>
                            </div>
                            <div className="inline-block mb-5 w-full xl:w-1/2">
                                <label htmlFor="lastName" className="block mb-2 text-sm font-medium">Last</label>
                                <input type="text" id="lastName" name="lastName" className="p-2.5" placeholder="Smith" required aria-required="true"></input>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="telephone" className="block mb-2 text-sm font-medium">Phone Number</label>
                            <input type="tel" id="telephone" name="telephone" className="p-2.5"
                                pattern="^\(?[0-9]{3}\)?-?[0-9]{3}-?[0-9]{4}" placeholder="(800)-123-4567" required aria-required="true"></input>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
                            <input type="email" id="email" name="email" className="p-2.5" placeholder="name@email.com" required aria-required="true"></input>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                            <input type="password" id="password" name="password" className="p-2.5" placeholder="**********" required aria-required="true"></input>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium">Confirm password</label>
                            <input type="password" id="repeat-password" name="repeat-password" className="p-2.5" placeholder="**********" required aria-required="true"></input>
                        </div>
                        <div className="flex items-start mb-5">
                            <div className="flex items-center h-5">
                                <input id="terms" name="terms" type="checkbox" value=""
                                    className="w-4 h-4 accent-pink-600 border border-gray-300 rounded bg-stone-0 focus:ring-3 focus:ring-pink-900 shadow-sm"
                                    required aria-required="true"></input>
                            </div>
                            <label htmlFor="terms" className="ms-2 text-sm font-medium">I agree with the <a href="/pages/terms.html"
                                className="text-pink-600 hover:underline hover:text-pink-700">terms and conditions</a></label>
                        </div>
                        <button type="submit" id="login" name="joinRewards"
                            className="text-white shadow-md bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Join Dragon Rewards</button>
                    </form>
                </div>
            </section>
            <div className="bg-matcha h-12">
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
                        src="https://japantoday-asset.scdn3.secure.raxcdn.com/img/store/41/2a/92968e7385db3e8b9b05dfffa14f9eacd6e2/sakura-boba-cherry-blossom-bubble-tea/_w1700.png"
                        alt="[Sakura Boba Cherry Blossom Bubble Tea].(2020, February 28). Sakura Boba Cherry Blossom Bubble Tea [Digital image]. Retrieved from URL https://japantoday.com/category/features/food/bubble-tea-stand-debuting-real-sakura-tapioca-for-cherry-blossom-strawberry-milk-boba"></img>
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
