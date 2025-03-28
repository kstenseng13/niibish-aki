export default function NonfunctionalHeader({title}) {
    return (
        <header className="bg-cover bg-[url('https://cdn.pixabay.com/photo/2020/06/15/09/23/green-tea-5301025_1280.jpg')] w-full"
        alt="hana_chado (Photographer).(2020, June 14). Green tea, Tea, Koreatea image. Free for use [digital image]. Retrieved from URL https://pixabay.com/photos/green-tea-tea-koreatea-korea-5301025/">
        <div className="text-yellow-50 displayHeader sm:px-16 md:px-24 text-center"  role="heading" aria-level="1">
            <span>{title}</span>
        </div>
    </header>
    );
};