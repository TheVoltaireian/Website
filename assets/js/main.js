const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const hiddenModifier = Array.from(entry.target.classList)
            .find((className) => className.endsWith('--hidden'));

        if (!hiddenModifier) return;
        const visibleModifier = hiddenModifier.replace('--hidden', '--visible');
        
        entry.target.classList.add(visibleModifier);
        observer.unobserve(entry.target);
    });
});

const hiddenModifiers = document.querySelectorAll('.projects__card--hidden, .projects__header--hidden');
hiddenModifiers.forEach((element) => observer.observe(element));

const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
        const card = entry.target.closest('.projects__card');
        if (card) {
        card.style.setProperty('--card-head-height', `${entry.target.offsetHeight}px`);
        }
    }
});

document.querySelectorAll('.projects__cardHead').forEach(head => {
    resizeObserver.observe(head);
});

console.log(String.raw`
 /$$      /$$ /$$ /$$       /$$ /$$    /$$          /$$   /$$               /$$                     /$$                    
| $$  /$ | $$|__/| $$      | $$| $$   | $$         | $$  | $$              |__/                    |__/                    
| $$ /$$$| $$ /$$| $$  /$$$$$$$| $$   | $$ /$$$$$$ | $$ /$$$$$$    /$$$$$$  /$$  /$$$$$$   /$$$$$$  /$$  /$$$$$$  /$$$$$$$ 
| $$/$$ $$ $$| $$| $$ /$$__  $$|  $$ / $$//$$__  $$| $$|_  $$_/   |____  $$| $$ /$$__  $$ /$$__  $$| $$ |____  $$| $$__  $$
| $$$$_  $$$$| $$| $$| $$  | $$ \  $$ $$/| $$  \ $$| $$  | $$      /$$$$$$$| $$| $$  \__/| $$$$$$$$| $$  /$$$$$$$| $$  \ $$
| $$$/ \  $$$| $$| $$| $$  | $$  \  $$$/ | $$  | $$| $$  | $$ /$$ /$$__  $$| $$| $$      | $$_____/| $$ /$$__  $$| $$  | $$
| $$/   \  $$| $$| $$|  $$$$$$$   \  $/  |  $$$$$$/| $$  |  $$$$/|  $$$$$$$| $$| $$      |  $$$$$$$| $$|  $$$$$$$| $$  | $$
|__/     \__/|__/|__/ \_______/    \_/    \______/ |__/   \___/   \_______/|__/|__/       \_______/|__/ \_______/|__/  |__/
`);