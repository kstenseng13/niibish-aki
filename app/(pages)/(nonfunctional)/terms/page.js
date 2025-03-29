import NonfunctionalHeader from "../../../components/nonfunctionalHeader";

export default function Terms() {
    return (
        <div>
            <NonfunctionalHeader title="Niibish Aki Terms and Conditions" />

            <div className="bg-teal h-12"></div>
            <div className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8">
                <div className="w-7/12">
                    <p className="text-lg font-semibold">Updated: March 28, 2025</p>

                    <p className="py-4">
                        <span className="font-semibold pr-1">How to Join the Program / How to Become a Leaf Rewards Member:</span>
                        To join the Niibish Aki Leaf Rewards program, simply create an account on our website or sign up during checkout. 
                        As a member, you will earn points on every purchase you make. These points can be redeemed for discounts, exclusive offers, and special gifts. 
                        Signing up is free, and there are no fees. Membership is open to anyone who enjoys our products and supports our commitment to expanding Indigenous cultures to our community..
                    </p>

                    <p className="py-4">
                        <span className="font-semibold pr-1">Eligibility:</span> To participate in the Leaf Rewards program, you must be at least 18 years old and reside within the county where we operate. 
                        Membership is limited to individuals, and businesses or organizations are not eligible to join. Additionally, to maintain the integrity of the program, 
                        members must comply with all applicable terms and conditions.
                    </p>

                    <p className="py-4">
                        <span className="font-semibold pr-1">How the Program Works:</span> The Leaf Rewards program allows members to earn points with every purchase. 
                        For every dollar spent on eligible products, you will earn 1 Leaf Point. Points can be redeemed for discounts, products, and exclusive offers at Niibish Aki.
                        <span className="font-semibold px-1">Earning Points:</span> Members earn points by purchasing products from our website or at our physical store. 
                        Additional points can be earned through special promotions, events, and referrals. You can track your points balance and progress toward rewards directly from your account page.
                    </p>

                    <p className="py-4">
                        <span className="font-semibold pr-1">Redeeming Points:</span> Points can be redeemed at checkout for discounts or exclusive rewards. 
                        A point is worth $1 USD, and you can redeem them in increments of 100 points for a $1 discount. Points cannot be exchanged for cash, nor can they be transferred to other accounts.
                        We also offer members the opportunity to donate points to support environmental or community initiatives that align with our sustainable mission.
                    </p>

                    <p className="py-4">
                        <span className="font-semibold pr-1">Bonus Points and Exclusive Offers:</span> Occasionally, we offer bonus points and exclusive promotions to our members. 
                        These can include double-point events, early access to new products, or limited-edition items made from sustainably sourced materials. 
                        You will be notified about these special offers through our email newsletter and on your account page. 
                        Be sure to check your inbox for updates on how to earn and redeem bonus points.
                    </p>

                    <p className="py-4">
                        <span className="font-semibold pr-1">Additional Terms:</span> Points expire if there is no activity (purchases or point redemptions) within 12 months. 
                        We reserve the right to cancel or modify the Leaf Rewards program at any time, and we may adjust how points are earned or redeemed. 
                        Points are non-transferable and cannot be shared between accounts. The program is subject to applicable laws, and Niibish Aki is not responsible for lost or stolen points.
                        Members must maintain accurate and up-to-date contact information to receive all the benefits and updates of the program.
                    </p>
                </div>
            </div>

            <div className="bg-salmonDark h-12"></div>
            <div aria-label="Featured Products">
                <h2 className="text-center mt-4">Explore Our Featured Products</h2>
                <div id="featuredProductsSection" className="productSection justify-center" aria-live="polite">
                    {/* TODO: Add Featured Products Section */}
                </div>
            </div>
        </div>
    );
};
