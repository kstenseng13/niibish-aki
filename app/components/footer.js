import Image from 'next/image';

export default function Footer() {
    return (
        <footer>
            <div className="text-center lg:text-left bg-matcha">
                <div className="mx-6 py-10 text-center md:text-left">
                    <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex items-center justifyCss">
                                <Image width={24} height={24} src="/logo.svg" alt="Small Niibish Aki Logo" className="w-8 pr-2" />
                                Niibish Aki
                            </h6>
                            <p>
                                At Niibish Aki, we combine traditional Asian tea culture with Indigenous ingredients to create unique, flavorful experiences. 
                                Rooted in the Ojibwe language, our name, Niibish Aki, means "Tea of the Earth," which reflects our deep connection to nature and community.
                                We're passionate about sharing stories and flavors that celebrate our heritage and bring Indigenous representation to Grand Forks, ND.
                            </p>
                        </div>
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex justifyCss">
                                Tea
                            </h6>
                            <p className="mb-4">
                                <a href="/aboutUs">Seasonal Offerings</a>
                            </p>
                            <p className="mb-4">
                                <a href="/sustainability">Sustainability</a>
                            </p>
                            <p className="mb-4">
                                <a href="/menu">Orders</a>
                            </p>
                        </div>
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex justifyCss">
                                Useful links
                            </h6>
                            <p className="mb-4">
                                <a href="/privacy">About Us</a>
                            </p>
                            <p className="mb-4">
                                <a href="/terms">Terms</a>
                            </p>
                            <p>
                                <a href="/contactUs">Contact Us</a>
                            </p>
                        </div>
                        <div>
                            <h6 className="uppercase font-semibold mb-4 flex justifyCss">
                                Contact
                            </h6>
                            <p className="flex items-center justifyCss mb-4">
                                <Image width={24} height={24} src="https://cdn.iconscout.com/icon/free/png-512/free-home-1767940-1502276.png?f=webp&w=256"
                                    alt="Akveo (Creator).(2019, July 30). Free Home Icon [Digital image]. Retrieved from URL https://iconscout.com/free-icon/home-1767940" className="w-8 pr-2"/>
                                Grand Forks, ND 58201, US
                            </p>
                            <p className="flex items-center justifyCss mb-4">
                                <Image width={24} height={24} src="https://cdn.iconscout.com/icon/free/png-512/free-email-1767971-1502307.png?f=webp&w=256"
                                    alt="Akveo (Creator).(2019, July 30). Free Email Icon [Digital image]. Retrieved from URL https://iconscout.com/free-icon/email-1767971" className="w-8 pr-2"/>
                                <a href="mailto:hello@niibishaki.com">hello@niibishaki.com</a>
                            </p>
                            <p className="flex items-center justifyCss mb-4">
                                <Image width={24} height={24} src="https://cdn.iconscout.com/icon/free/png-512/free-phone-1768011-1502185.png?f=webp&w=256"
                                    alt="Akveo (Creator).(2019, July 30). Free Phone Icon [Digital image]. Retrieved from URL https://iconscout.com/free-icon/phone-1768011" className="w-8 pr-2"/>
                                <a href="tel:+18008675309">+700 555-1234</a>
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