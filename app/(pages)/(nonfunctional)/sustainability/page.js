import ActionItemsSection from "../../../components/actionItemsSection";
import NonfunctionalHeader from "../../../components/nonfunctionalHeader";
import Image from 'next/image';

export default function Sustainability() {
    return (
        <div>
            <NonfunctionalHeader title="Sustainability" />
            <div className="bg-tealDark h-12"></div>

            <main className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8" role="main">
                <div className="w-7/12">
                    <h1>Our Commitment to Sustainable Practices</h1>
                    <p className="py-4">
                        At Niibish Aki, sustainability is at the heart of everything we do. Our mission is to create a positive impact 
                        on the environment, support local communities, and preserve natural resources through ethical and sustainable 
                        practices. We are dedicated to harvesting tea and other ingredients in a way that respects both nature and 
                        tradition, ensuring that future generations can continue to enjoy the natural beauty of the world.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Sustainable Tea Harvesting:</span> Our tea is harvested with a deep commitment to 
                        environmental stewardship. We work closely with growers who use organic, pesticide-free methods to cultivate 
                        their crops. By employing sustainable farming techniques, such as agroforestry and soil conservation, we help 
                        preserve biodiversity, reduce water consumption, and protect natural habitats.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Locally Sourcing Indigenous Ingredients:</span> At Niibish Aki, we take pride in 
                        supporting local economies by sourcing indigenous ingredients from native growers and producers. By purchasing 
                        directly from these local farms and communities, we reduce the carbon footprint associated with transportation 
                        and help maintain cultural traditions. From native herbs and spices to sustainably grown fruits, every ingredient 
                        is chosen with care and respect for its origin.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Carbon-Neutral Products:</span> Wherever possible, we prioritize the use of carbon-neutral products. 
                        We are proud to offer alternatives like agave straws, biodegradable packaging, and eco-friendly materials that minimize waste. 
                        Our goal is to eliminate single-use plastics and reduce our overall environmental impact. By supporting companies that 
                        share our commitment to sustainability, we help create a circular economy that benefits both people and the planet.
                    </p>
                    <div className="py-4">
                        <span className="font-semibold">Key Initiatives:</span>
                        <ul className="list-disc pl-6 py-2">
                            <li>Partnering with small, local farms that use eco-friendly practices to grow tea and other ingredients</li>
                            <li>Using only organic, pesticide-free tea harvested through sustainable practices</li>
                            <li>Reducing waste by using recyclable, compostable, and biodegradable materials</li>
                            <li>Adopting carbon-neutral practices wherever possible, including using agave straws and biodegradable packaging</li>
                            <li>Committing to fair trade and ethical sourcing practices that support indigenous farmers and local communities</li>
                        </ul>
                    </div>
                    <p className="py-4">
                        <span className="font-semibold">Looking Ahead:</span> As we continue to grow, our sustainability efforts will only 
                        intensify. We are actively working towards achieving carbon neutrality across all our operations and expanding 
                        our use of sustainable and eco-friendly products. Our goal is to create a positive environmental impact while 
                        fostering a more sustainable future for the communities and ecosystems we work with.
                    </p>
                </div>
                <aside className="w-full h-full flex justify-center items-center mg:w-1/2 lg:w-1/3" aria-label="Sustainability Image">
                    <Image height={500} width={200}
                        src="https://images.pexels.com/photos/1846567/pexels-photo-1846567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="A collection of natural herbs and tea leaves [Photograph]. Pexels. https://images.pexels.com/photos/1846567/pexels-photo-1846567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        className="w-1/2 object-contain"
                    />
                </aside>
            </main>
            <ActionItemsSection/>
        </div>
    );
};
