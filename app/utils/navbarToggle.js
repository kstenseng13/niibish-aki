// src/utils/navbarToggle.js
export function toggleNavbarMenu() {
    document.addEventListener('click', function(event) {
        var menuToggle = document.getElementById('toggleMenu');
        var menu = document.getElementById('mobileMenu');

        // Check if the click was inside the menu or the toggle button itself
        if (menu && menuToggle && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
            if (menu.classList.contains('block')) {
                menu.classList.add('hidden');
                menu.classList.remove('block');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
        else if (menuToggle.contains(event.target)) {
            menu.classList.toggle('hidden');
            menu.classList.toggle('block');
            menuToggle.setAttribute('aria-expanded', menu.classList.contains('block').toString());
        }
    });
}
