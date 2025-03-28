

export default function RegisterForm() {
    return (
        <div className="shrink basis-3/4 lg:basis-1/3">
            <form aria-labelledby="register">
                <div>
                    <div className="inline-block mb-5 mr-1 w-full xl:w-[49%]">
                        <label htmlFor="firstName" className="block mb-2 text-sm font-medium">First Name</label>
                        <input type="text" id="firstName" name="firstName" className="p-2.5" placeholder="Jane" required />
                    </div>
                    <div className="inline-block mb-5 w-full xl:w-1/2">
                        <label htmlFor="lastName" className="block mb-2 text-sm font-medium">Last Name</label>
                        <input type="text" id="lastName" name="lastName" className="p-2.5" placeholder="Smith" required />
                    </div>
                </div>
                <div className="mb-5">
                    <label htmlFor="telephone" className="block mb-2 text-sm font-medium">Phone Number</label>
                    <input type="tel" id="telephone" name="telephone" className="p-2.5"
                        pattern="^\(?[0-9]{3}\)?-?[0-9]{3}-?[0-9]{4}" placeholder="(800)-123-4567"
                        aria-describedby="telephone" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
                    <input type="email" id="email" name="email" className="p-2.5" placeholder="name@email.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
                    <input type="password" id="password" name="password" className="p-2.5" placeholder="**********" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium">Confirm Password</label>
                    <input type="password" id="repeat-password" name="repeat-password" className="p-2.5" placeholder="**********" required />
                </div>
                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input id="terms" name="terms" type="checkbox" value=""
                            className="w-4 h-4 accent-amber-600 border border-gray-300 rounded bg-stone-0 focus:ring-3 focus:ring-amber-900 shadow-sm"
                            required aria-required="true"></input>
                    </div>
                    <label htmlFor="terms" className="ms-2 text-sm font-medium">I agree with the <a href="/terms"
                        className="text-amber-600 hover:underline hover:text-amber-700">terms and conditions</a></label>
                </div>
                <button type="submit" id="login" name="joinRewards"
                    className="text-white shadow-md bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Join Leaf Rewards</button>
            </form>
        </div>
    );
}