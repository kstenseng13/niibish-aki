import ActionItemsSection from "../../../components/actionItemsSection";
import NonfunctionalHeader from "../../../components/nonfunctionalHeader";
import Image from 'next/image';

export default function AboutUs() {
    return (
        <div>
            <NonfunctionalHeader title="About Us" />
            <div className="bg-matchaDark h-12"></div>

            <main className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8" role="main">
                <div className="w-7/12">
                    <h1>Welcome to Niibish Aki!</h1>
                    <p className="py-4">
                        At Niibish Aki, we blend two rich traditions into one unique experience. We&quot;re a local tea shop in Grand Forks, North Dakota, 
                        where we celebrate and elevate the flavors of Indigenous ingredients and Asian tea traditions. Our mission is simple: 
                        create a space where culture, flavors, and people come together, offering a refreshing twist on what a tea shop can be.
                    </p>
                    <p className="py-4">
                        Niibish Aki was born out of a love for boba teas and a deep appreciation for the diverse ingredients found within Indigenous 
                        cultures. Growing up surrounded by reservations, we saw firsthand the lack of visibility and representation of Indigenous 
                        culture in everyday life. Our goal is to provide that representation, infusing our tea offerings with flavors and ingredients 
                        native to North America — like chokecherries, wild rice, and cedar — creating a fusion of Asian tea traditions and Native American 
                        flavors that celebrates and shares our heritage with the community.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Our Mission:</span> At Niibish Aki, our mission is to offer more than just great tea. 
                        We&quot;re committed to supporting Indigenous visibility and cultural pride within the Grand Forks community, where many reservations 
                        are located but where the visibility of Native American cultures is often limited. By creating a platform where traditional 
                        Indigenous ingredients meet modern tea traditions, we aim to help our community connect to new flavors, old traditions, and 
                        the stories they carry.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Our Vision:</span> We envision a future where Indigenous ingredients are more than just a 
                        novelty; they are celebrated for their unique flavors and deep cultural significance. We want to help expand the flavor 
                        horizons of the people around us, offering a taste of something new while honoring the traditions that have sustained 
                        Native communities for generations. Through this, we aim to build connections that strengthen cultural visibility and 
                        foster a deeper understanding and appreciation for Native American traditions.
                    </p>
                    <p className="py-4">
                        Niibish Aki is Ojibwe for “Tea of the Earth.” The name reflects both my heritage as a member of the White Earth Nation and the 
                        deep connection my family has to the land. Growing up, my grandma and great aunt often spoke fondly of the word “niibish,” 
                        meaning “water” or “tea,” which always held a sense of comfort, connection, and nourishment. It is a name that honors my 
                        Ojibwe roots while also celebrating the natural world that provides us with so much — from the earth to the plants, herbs, and 
                        ingredients we use in our teas.
                    </p>
                </div>
                <aside className="w-full h-full flex justify-center items-center mg:w-1/2 lg:w-1/3" aria-label="About Us Image">
                    <Image height={500} width={200}
                        src="https://images.pexels.com/photos/6412834/pexels-photo-6412834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Yuan, T. (2021). A person holding a milk tea [Photograph]. Pexels. https://images.pexels.com/photos/6412834/pexels-photo-6412834.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        className="w-1/2 object-contain"
                    />
                </aside>
            </main>
            <ActionItemsSection />
        </div>
    );
};
