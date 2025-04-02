import RegisterForm from "../../../components/register";

export default function Register() {
    return (
        <div>
            <div className="flex w-full flex-wrap backgroundWhiteSmoke">
                <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
                    <div className="my-auto flex flex-col justify-center px-6 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
                        <div className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl pb-12">
                            <p>Welcome to</p>
                            <p><span className="text-amber-600">Leaf Rewards</span></p>
                        </div>
                        <RegisterForm />
                        <div className="pt-8 pb-8 text-center">
                            <p className="whitespace-nowrap">
                                Already have an account?
                                <a href="/login" className="font-semibold underline hover:text-stone-600"> Login here</a>.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="hidden shadow-inner md:block md:w-1/2 lg:w-2/3 bg-cover bg-[linear-gradient(to_bottom,rgba(36,13,5,0.3),rgba(214,77,31,0.1)),url('https://i.ebayimg.com/images/g/QzgAAOSww9hlC7EN/s-l1200.webp')]"
                    aria-label="Background image of a boba tea shop with chalkboard art. Retrieved from URL https://www.ebay.com/itm/394892006242">
                    <div className="h-screen w-full"></div>
                </div>
            </div>
            <div className="bg-matchaDark h-12"></div>
        </div>
    );
};