import RegisterForm from "./components/register";
import ActionItemsSection from "./components/actionItemsSection";

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
            <ActionItemsSection/>
            <div id="footer" className="text-center lg:text-left bg-matcha"></div>
        </div>
    );
}
