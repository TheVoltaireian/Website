document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const hiddenModifier = [...entry.target.classList]
                .find(className => className.endsWith('--hidden'));

            if (!hiddenModifier) return;

            entry.target.classList.add(
                hiddenModifier.replace('--hidden', '--visible')
            );

            observer.unobserve(entry.target);
        });
    });

    document
        .querySelectorAll(
            '.projects__card--hidden, ' +
            '.projects__header--hidden, ' +
            '.blog__post--hidden, ' +
            '.blog__header--hidden'
        )
        .forEach(element => observer.observe(element));
});

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

let mouseX = 0;
let mouseY = 0;

let lerpedX = 0;
let lerpedY = 0;

document.addEventListener("mousemove", e => {
    mouseX = e.clientX / window.innerWidth * 20 - 10;
    mouseY = e.clientY / window.innerHeight * 20 - 10;
});

const tweets = document.querySelectorAll("#WildVoltaireian");

function update() {
    lerpedX += (mouseX - lerpedX) * 0.05;
    lerpedY += (mouseY - lerpedY) * 0.05;

    tweets.forEach(tweet => {
        tweet.style.transform =
            `translate(${lerpedX}px, ${lerpedY}px) rotate(${lerpedX * 0.15}deg)`;
    });

    requestAnimationFrame(update);
}

update();

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