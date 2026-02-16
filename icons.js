// Export icons data and rendering utility as an ES module.  Using an
// exported array and function avoids leaking variables into the global
// scope.  Modularization is a recommended best practice that keeps
// code maintainable and prevents accidental global variables【676496972847746†L94-L98】.
export const icons = [
    {
        name: "Safari's Room",
        img: './assets/icon-1.png',
        label: `Safari's <br> Room`,
        dataWindow: 'scumners-room'
    },
    {
        name: 'Contact',
        img: './assets/icon-2.png',
        label: 'Contact',
        dataWindow: 'contact',
        // Update this to the desired contact action (mailto: or a contact page)
        url: 'mailto:hello@example.com'
    },
    {
        name: 'Press',
        img: './assets/icon-4.png',
        label: 'Press',
        dataWindow: 'press'
    },
    {
        name: 'Assisting',
        img: './assets/icon-7.png',
        label: 'Assisting',
        dataWindow: 'assisting'

    },
    {
        name: 'Graphic design',
        img: './assets/icon-10.png',
        label: 'graphic design',
        dataWindow: 'design'

    },
    {
        name: 'Instagram',
        img: './assets/icon-6.png',
        label: 'Instagram',
        dataWindow: 'instagram',
        // Replace with your Instagram handle or landing page
        url: 'https://instagram.com/'

    },
    {
        name: 'Journal',
        img: './assets/icon-9.png',
        label: 'Journal',
        dataWindow: 'journal',
        url: '/journal/'

    },
    {
        name: 'Music Vidz',
        img: './assets/icon-11.png',
        label: 'Music Vidz',
        dataWindow: 'musicvidz'

    },
    {
        name: 'Find Me',
        img: './assets/icon-12.png',
        label: 'Find Me',
        dataWindow: 'find-me',
        // Could link to a map or contact page
        url: '/find-me/'

    },
];

/**
 * Render desktop icons into the provided container selector.  Each icon
 * element is given a role of “button” for accessibility, a tab index for
 * keyboard navigation and an aria-label derived from the icon name.  Using
 * `role="button"` makes the div behave like an interactive control to
 * assistive technologies【75133028820200†L87-L139】.
 *
 * @param {string} containerSelector A CSS selector for the icon
 *   container. Defaults to `#icons`.
 */
export function renderIcons(containerSelector = '#icons') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const markup = icons
        .map((icon) => {
            return `
            <div class="icon" data-window="${icon.dataWindow}" tabindex="0" role="button" aria-label="${icon.name}">
                <div class="icon__image">
                    <img src="${icon.img}" alt="${icon.name} icon" />
                </div>
                <span class="icon__label">${icon.label}</span>
            </div>
            `;
        })
        .join('');
    container.innerHTML = markup;
}