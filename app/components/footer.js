export default function Footer() {
    return (
        <footer>
            <div className="text-center lg:text-left bg-matcha">
                <div className="mx-6 py-10 text-center md:text-left">
                    <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h6 className="uppercase font-semibold mb-4
            flex items-center justifyCss">
                                <img src="/logo.svg" alt="Small Niibish Aki Logo" className="w-8 pr-2"></img>
                                Niibish Aki
                            </h6>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque leo id ligula eleifend
                                ultricies.
                                Cras a orci tortor. Aenean ac mi faucibus mauris mollis hendrerit viverra gravida enim.
                            </p>
                        </div>
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex justifyCss">
                                Tea
                            </h6>
                            <p className="mb-4">
                                <a href="#!">Seasonal Offerings</a>
                            </p>
                            <p className="mb-4">
                                <a href="#!">Sustainability</a>
                            </p>
                            <p className="mb-4">
                                <a href="#!">Orders</a>
                            </p>
                        </div>
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex justifyCss">
                                Useful links
                            </h6>
                            <p className="mb-4">
                                <a href="/aboutUs">About Us</a>
                            </p>
                            <p className="mb-4">
                                <a href="#!">Help</a>
                            </p>
                            <p>
                                <a href="#!">Contact Us</a>
                            </p>
                        </div>
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex justifyCss">
                                Contact
                            </h6>
                            <p className="flex items-center justifyCss mb-4">
                                <img src="https://cdn.iconscout.com/icon/free/png-512/free-home-1767940-1502276.png?f=webp&w=256"
                                    alt="Akveo (Creator).(2019, July 30). Free Home Icon [Digital image]. Retrieved from URL https://iconscout.com/free-icon/home-1767940" className="w-8 pr-2"></img>
                                Grand Forks, ND 58201, US
                            </p>
                            <p className="flex items-center justifyCss mb-4">
                                <img src="https://cdn.iconscout.com/icon/free/png-512/free-email-1767971-1502307.png?f=webp&w=256"
                                    alt="Akveo (Creator).(2019, July 30). Free Email Icon [Digital image]. Retrieved from URL https://iconscout.com/free-icon/email-1767971" className="w-8 pr-2"></img>
                                <a href="mailto:testing@mctestface.com">hello@niibish-aki.com</a>
                            </p>
                            <p className="flex items-center justifyCss mb-4">
                                <img src="https://cdn.iconscout.com/icon/free/png-512/free-phone-1768011-1502185.png?f=webp&w=256"
                                    alt="Akveo (Creator).(2019, July 30). Free Phone Icon [Digital image]. Retrieved from URL https://iconscout.com/free-icon/phone-1768011" className="w-8 pr-2"></img>
                                <a href="tel:867-5309">+ 800 867 5309</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-center p-3 bg-teal">
                    <span>© 2025 Copyright:</span>
                    <span className="font-semibold">Niibish Aki</span>
                </div>
            </div>
        </footer>
    );
}