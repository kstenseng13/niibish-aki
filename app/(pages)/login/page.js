

export default function Login() {
    return (
        <div>
            <div className="flex w-full flex-wrap backgroundWhiteSmoke">
                <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
                    <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
                        <div className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
                            <p>Welcome back to</p>
                            <p><span className="text-amber-600">Leaf Rewards</span></p>
                        </div>
                        <form className="flex flex-col pt-3 md:pt-8" id="loginForm" aria-labelledby="login-form-heading">
                            <div className="flex flex-col pt-4">
                                <label htmlFor="login-email" className="sr-only">Email</label>
                                <input type="email" id="login-email"
                                    className="w-full flex-1 appearance-none border-gray-300 py-2 px-4 text-base placeholder-gray-400 focus:outline-none"
                                    placeholder="Email" aria-required="true" aria-describedby="email-help"/>
                                    <span id="email-help" className="sr-only">Enter your email address</span>
                            </div>
                            <div className="mb-12 flex flex-col pt-4">
                                <label htmlFor="login-password" className="sr-only">Password</label>
                                <input type="password" id="login-password"
                                    className="w-full flex-1 appearance-none border-gray-300 py-2 px-4 text-base placeholder-gray-400 focus:outline-none"
                                    placeholder="Password" aria-required="true" aria-describedby="password-help"/>
                                    <span id="password-help" className="sr-only">Enter your password</span>
                            </div>
                            <button type="submit" id="login"
                                className="text-white shadow-md bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <span className="w-full"> Login </span>
                            </button>
                        </form>
                        <div className="pt-12 pb-12 text-center">
                            <p className="whitespace-nowrap">
                                Don&apos;t have an account?
                                <a href="/register" className="font-semibold underline hover:text-stone-600"> Register here</a>.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="hidden  shadow-inner md:block md:w-1/2 lg:w-2/3 bg-cover bg-[linear-gradient(to_bottom,rgba(36,13,5,0.3),rgba(214,77,31,0.1)),url('https://i.ebayimg.com/images/g/QzgAAOSww9hlC7EN/s-l1200.webp')]"
                    aria-label="Boba tea shop with chalkboard art [Digital image]. Retrieved from URL https://www.ebay.com/itm/394892006242">
                    <div className="h-screen w-full"></div>
                </div>
            </div>
            <div className="bg-salmonDark h-12"></div>
            </div>
    );
};