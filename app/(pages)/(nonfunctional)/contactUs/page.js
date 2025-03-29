import Image from 'next/image'
import NonfunctionalHeader from "../../../components/nonfunctionalHeader";

export default function ContactUs() {
    return (
        <div>
            <NonfunctionalHeader title="Contact Us" />
            <div className="bg-salmonDark h-12"></div>
            <main className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8" role="main">
                <div className="w-7/12 pl-8">
                    <h1>Contact Niibish Aki</h1>
                    <p className="py-4">
                        We would love to hear from you! Whether you have questions about our menu, our ingredients, or just want to say hello, 
                        feel free to reach out to us. We are always excited to connect with our community and customers.
                    </p>
                    <p className="py-4">
                        You can contact us through email, or if you are in the Grand Forks area, feel free to stop by the shop!
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Email:</span> 
                        <a href="mailto:hello@niibish-aki.com" className="text-teal-600 hover:underline">hello@niibish-aki.com</a>
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Address:</span>
                        22 3rd Street S. Grand Forks, ND 58201
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Phone:</span> (701) 555-1234
                    </p>
                    <p className="py-4">
                        We are open every day from 10:00 AM to 8:00 PM. Stop by and enjoy our unique blends, or just come chat with us! 
                        We are here to bring a little piece of culture and community to Grand Forks.
                    </p>
                </div>
                <aside className="w-full h-full flex justify-center items-center mg:w-1/2 lg:w-[40%]" aria-label="Contact Us Image">
                    <Image width={400} height={400}
                        src="https://cornerstonecaregiving.com/wp-content/uploads/Banner-Grand-Forks-ND-scaled-1705x1705.jpg"
                        alt="Crary Real Estate" 
                        className="w-1/2 object-contain"
                    />
                </aside>
            </main>
        </div>
    );
}
