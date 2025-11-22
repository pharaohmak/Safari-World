import { renderIcons, icons } from './icons.js';

function init() {
    console.log('Desktop environment initializing...');
    // Render icons into the desktop
    renderIcons();
    // Initialise clock, windows, explorer, start menu and popups
    initClock();
    initWindowEvents();
    initWorkExplorer();
    initStartMenu();
    initPopups();
    // Initialise form handlers (signup etc.)
    initForms();
}

function initClock() {
    const clock = document.getElementById('clock');
    if (!clock) return;
    const update = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    update();
    setInterval(update, 1000);
}

function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => {
        w.style.zIndex = '50';
    });
    win.style.zIndex = '100';
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('window--open');
        win.classList.remove('window--minimized');
        win.style.display = 'flex';
        win.setAttribute('aria-hidden', 'false');
        bringToFront(win);
        return;
    }

    const icon = icons.find((i) => i.dataWindow === id || i.name === id);
    if (icon && icon.url) {
        try {
            window.open(icon.url, '_blank', 'noopener');
        } catch (err) {
            console.warn('Unable to open URL for icon', icon, err);
            showToast('Unable to open link');
        }
        return;
    }
    console.warn(`No window with id "${id}" and no URL configured for this icon.`);
    showToast(`No app for “${id}”. Add a window or set a url in icons.js`);
}

function showToast(message, duration = 3000) {
    const t = document.createElement('div');
    t.textContent = message;
    Object.assign(t.style, {
        position: 'fixed',
        left: '50%',
        bottom: '80px',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        zIndex: 99999,
        fontFamily: 'sans-serif',
        fontSize: '13px',
    });
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.transition = 'opacity 200ms ease';
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 220);
    }, duration);
}

function closeWindow(win) {
    if (!win) return;
    win.classList.remove('window--open');
    win.classList.remove('window--minimized');
    win.style.display = 'none';
    win.setAttribute('aria-hidden', 'true');
}

function minimizeWindow(win) {
    if (!win) return;
    const minimized = win.classList.toggle('window--minimized');
    if (minimized) {
        win.classList.remove('window--open');
        win.style.display = 'none';
        win.setAttribute('aria-hidden', 'true');
    } else {
        win.style.display = 'flex';
        win.setAttribute('aria-hidden', 'false');
        win.classList.add('window--open');
        bringToFront(win);
    }
}

function initWindowEvents() {
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.addEventListener('click', (e) => {
            const icon = e.target.closest('.icon[data-window]');
            if (icon) {
                openWindow(icon.dataset.window);
            }
        });
        // Support keyboard activation on icons (Enter/Space)
        desktop.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const icon = e.target.closest('.icon[data-window]');
                if (icon) {
                    e.preventDefault();
                    openWindow(icon.dataset.window);
                }
            }
        });
    }
    // Delegate menubar link clicks
    const menubarLinks = document.querySelector('.menubar__links');
    if (menubarLinks) {
        menubarLinks.addEventListener('click', (e) => {
            const link = e.target.closest('.menubar__link[data-window]');
            if (link) {
                e.preventDefault();
                openWindow(link.dataset.window);
            }
        });
    }
    // Delegate menubar icon clicks (e.g., profile icon)
    const menubarIcons = document.querySelector('.menubar__icons');
    if (menubarIcons) {
        menubarIcons.addEventListener('click', (e) => {
            const icon = e.target.closest('.menubar__icon[data-window]');
            if (icon) {
                openWindow(icon.dataset.window);
            }
        });
        // Keyboard support for menubar icons
        menubarIcons.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const icon = e.target.closest('.menubar__icon[data-window]');
                if (icon) {
                    e.preventDefault();
                    openWindow(icon.dataset.window);
                }
            }
        });
    }
    // Delegate titlebar button actions
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.titlebar__button');
        if (!btn) return;
        const win = btn.closest('.window');
        if (btn.classList.contains('close')) {
            closeWindow(win);
        } else if (btn.classList.contains('min')) {
            minimizeWindow(win);
        }
    });
    // ESC key closes all open windows
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.window.window--open').forEach((win) => closeWindow(win));
        }
    });
}

function initWorkExplorer() {
    const sidebar = document.querySelector('.work__sidebar');
    if (!sidebar) return;

    // Cache gallery sets and sidebar items
    const gallerySets = document.querySelectorAll('.gallery-set');
    const items = sidebar.querySelectorAll('li[data-folder]');

    // Attach a single click handler per sidebar item (once)
    items.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const folder = item.dataset.folder;
            if (!folder) return;

            // hide every gallery before showing the new one
            gallerySets.forEach((set) => {
                set.hidden = true;
            });

            // show the selected gallery
            const activeGallery = document.getElementById('gallery-' + folder);
            if (activeGallery) activeGallery.hidden = false;

            // update the selected state on the sidebar
            items.forEach((li) => li.classList.remove('selected'));
            item.classList.add('selected');
        });
    });

    // If a gallery is visible by default, mark the corresponding sidebar item
    const visible = Array.from(gallerySets).find((s) => !s.hidden);
    if (visible) {
        const id = visible.id && visible.id.replace(/^gallery-/, '');
        const selectedLi = sidebar.querySelector(`li[data-folder="${id}"]`);
        if (selectedLi) selectedLi.classList.add('selected');
    }
}

function initPopups() {
    const popupIds = ['popup-love', 'popup-swag', 'popup-hire', 'popup-compromised'];
    popupIds.forEach((id) => {
        const win = document.getElementById(id);
        if (!win) return;
        openWindow(id);
        setTimeout(() => {
            closeWindow(win);
        }, 5000);
    });
}

function initForms() {
    document.addEventListener('submit', (e) => {
        const form = e.target.closest('.signup-form');
        if (!form) return;
        e.preventDefault();
        const fd = new FormData(form);
        const name = (fd.get('name') || '').toString().trim();
        const email = (fd.get('email') || '').toString().trim();
        const password = (fd.get('password') || '').toString();
        const confirm = (fd.get('confirm') || '').toString();
        if (!name || !email || !password || !confirm) {
            showToast('Please complete all fields');
            return;
        }
        if (password !== confirm) {
            showToast('Passwords do not match');
            return;
        }
        // Placeholder: pretend we sent data to a server
        console.log('Signup:', { name, email });
        showToast('Thanks! Check your email to confirm signup');
        form.reset();
        // Close the profile window if present
        const win = form.closest('.window');
        if (win) closeWindow(win);
    });
}

function initStartMenu() {
    const startButton = document.querySelector('.taskbar__start');
    const startMenu = document.getElementById('start-menu');
    if (!startButton || !startMenu) return;
    // Toggle menu on start button click
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = startMenu.classList.toggle('start-menu--open');
        startMenu.setAttribute('aria-hidden', String(!isOpen));
    });
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.classList.remove('start-menu--open');
            startMenu.setAttribute('aria-hidden', 'true');
        }
    });
    // Handle item clicks
    startMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.start-menu__item[data-window]');
        if (!item) return;
        const target = item.dataset.window;
        if (target) openWindow(target);
        startMenu.classList.remove('start-menu--open');
        startMenu.setAttribute('aria-hidden', 'true');
    });
}

// Kick off initialisation once the DOM is ready
document.addEventListener('DOMContentLoaded', init);