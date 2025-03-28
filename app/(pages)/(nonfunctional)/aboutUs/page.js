import NonfunctionalHeader from "../../../components/nonfunctionalHeader";
import Image from 'next/image';

export default function AboutUs() {
    return (
        <div>
            <NonfunctionalHeader title="About Us" />
            <main className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8" role="main">
                <div className="w-7/12">
                    <h1>Welcome to Niibish Aki!</h1>
                    <p className="py-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis arcu id nulla consequat
                        ultricies. Fusce et fermentum ante. In hac habitasse platea dictumst. Vivamus et turpis ut purus
                        suscipit aliquet. Nulla facilisi. Aliquam erat volutpat. Mauris at magna et arcu tincidunt dapibus
                        in nec nisi. Donec venenatis orci eu lectus bibendum, nec tincidunt urna fermentum. Pellentesque
                        habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Our Mission:</span> Donec luctus dui vel sapien volutpat, eget gravida
                        magna interdum. Aliquam erat volutpat. Praesent imperdiet odio et nisl pharetra facilisis. Suspendisse
                        potenti. Integer non eros ut risus facilisis scelerisque. Integer sit amet convallis turpis, a
                        faucibus nulla. Etiam sed tincidunt erat. Sed feugiat sapien sit amet lorem cursus, eu iaculis
                        tortor vestibulum.
                    </p>
                    <p className="py-4">
                        <span className="font-semibold">Our Vision:</span> Duis a bibendum lacus, vel fermentum purus. Phasellus
                        blandit est ut ex tempor, sed maximus risus tincidunt. Integer id nisl eget sapien elementum vehicula.
                        Nullam varius magna ac ante vulputate, id dignissim felis varius. In consequat quam nec libero
                        fringilla auctor. Sed vel feugiat urna. Nulla facilisi. Suspendisse potenti. Mauris vel mi euismod
                        molestie orci, id accumsan dui.
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
        </div>
    );
};