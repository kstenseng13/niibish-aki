export function toggleNavbarMenu() {
    const closeMenu = () => {
        const mobileMenu = document.getElementById('mobileMenu');
        const toggleButton = document.getElementById('toggleMenu');

        if (mobileMenu?.classList.contains('block')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('block');
            toggleButton?.setAttribute('aria-expanded', 'false');
        }
    };

    const handleDocumentClick = (event) => {
        const mobileMenu = document.getElementById('mobileMenu');
        const toggleButton = document.getElementById('toggleMenu');

        if (!mobileMenu || !toggleButton) return;

        if (toggleButton.contains(event.target)) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
            toggleButton.setAttribute('aria-expanded', mobileMenu.classList.contains('block').toString());
            return;
        }

        if (!mobileMenu.contains(event.target) && mobileMenu.classList.contains('block')) {
            closeMenu();
        }
    };

    document.addEventListener('click', handleDocumentClick);

    return { closeMenu };
}
