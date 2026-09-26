// card animations
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

// card height calculator
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

// mouse anim (via: https://github.com/whoscripting/whoscripting.github.io/blob/master/landing/landing.js / MODIFIED)
const h1Element = document.querySelector("#WildVoltaireian");

let mouseX = 0;
let mouseY = 0;

let lerpedX = 0;
let lerpedY = 0;

if (h1Element) {
    document.addEventListener("mousemove", (event) => {
        const rect = h1Element.getBoundingClientRect();

        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        const relativeX = (event.clientX - elementCenterX) / rect.width;
        const relativeY = (event.clientY - elementCenterY) / rect.height;

        mouseX = Math.max(-10, Math.min(10, relativeX * 5));
        mouseY = Math.max(-10, Math.min(10, relativeY * 5));
    });

    function update() {
        lerpedX += (mouseX - lerpedX) * 0.05;
        lerpedY += (mouseY - lerpedY) * 0.05;

        h1Element.style.transform =
            `translate(${lerpedX}px, ${lerpedY}px) rotate(${lerpedX * 0.15}deg)`;

        requestAnimationFrame(update);
    }

    update();
}

// The following code is licensed under the MIT license (via: https://github.com/Roblox-Indie-Wikis/irwa-website/blob/main/assets/js/toc-init.js)

// TOC Init: Creates and initializes TOC for pages with h2 headings on page load
function initializeTOC() {
    // Check if TOC is enabled on this page
    const body = document.body;
    if (!body || !body.classList.contains('toc-enabled')) {
        return;
    }

    const contentEntry = document.querySelector('.post__mainEntry');
    if (!contentEntry) return;

    // Check if page already has a TOC (skip re-initialization)
    if (contentEntry.querySelector('.toc-wrapper')) {
        return;
    }

    // Only initialize on pages that have h2 headings (excluding headings inside extra wrapper divs)
    const h2s = Array.from(contentEntry.querySelectorAll('h2')).filter((h2) => {
        if (!h2.parentElement) return false;
        if (h2.parentElement.classList.contains('post__mainEntry')) return true;
        if (h2.parentElement.tagName.toLowerCase() !== 'div') return true;
        return false;
    });

    if (h2s.length === 0) {
        return;
    }

    // Check if TOCWrapper class exists
    if (typeof TOCWrapper === 'undefined') {
        return;
    }

    // Initialize TOC wrapper and sticky functionality
    const tocWrapper = new TOCWrapper();
    const toc = tocWrapper.init();

    if (toc && typeof TOCSticky !== 'undefined') {
        new TOCSticky(toc);
    }
}

// TOC Sticky: Handles sticky positioning and mobile toggle functionality
class TOCSticky {
	constructor(tocElement) {
		this.tocElement = tocElement;
		this.toggleBtn = tocElement.querySelector(".toc-toggle");
		this.tocNav = tocElement.querySelector(".toc-nav");
		this.isOpen = true;
		this.isMobile = null;

		this.init();
	}

	/**
	 * Initialize event listeners
	 */
	init() {
		if (this.toggleBtn) {
			this.toggleBtn.addEventListener("click", () => this.toggleToc());
		}

		// Handle window resize for responsive behavior
		window.addEventListener("resize", () => this.handleResize());

		// Set initial state based on screen size
		this.setInitialState();

		// Handle scroll for active link highlighting
		this.setupScrollTracking();
	}

	/**
	 * Determine initial state based on screen size
	 */
	setInitialState() {
		const newIsMobile = window.innerWidth < 992;

		if (newIsMobile === this.isMobile) return;

		this.isMobile = newIsMobile;
		if (this.isMobile) {
			this.closeToc();
		} else {
			this.openToc();
		}
	}

	/**
	 * Handle window resize events
	 */
	handleResize() {
		this.setInitialState();
	}

	/**
	 * Toggle TOC visibility (mainly for mobile)
	 */
	toggleToc() {
		if (this.isOpen) {
			this.closeToc();
		} else {
			this.openToc();
		}
	}

	/**
	 * Close TOC
	 */
	closeToc() {
		this.isOpen = false;
		this.tocElement.classList.add("is-closed");
		this.tocNav.setAttribute("aria-hidden", "true");
		this.toggleBtn.setAttribute("aria-expanded", "false");
		this.toggleBtn.innerHTML = '<span class="toc-toggle-icon">☰</span>';
	}

	/**
	 * Open TOC
	 */
	openToc() {
		this.isOpen = true;
		this.tocElement.classList.remove("is-closed");
		this.tocNav.setAttribute("aria-hidden", "false");
		this.toggleBtn.setAttribute("aria-expanded", "true");
		this.toggleBtn.innerHTML = '<span class="toc-toggle-icon">✕</span>';
	}

	/**
	 * Track scroll position and update active link highlighting
	 */
	setupScrollTracking() {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.setActiveLink(entry.target.id);
					}
				});
			},
			{
				rootMargin: "0px 0px -50% 0px", // Only consider top 50% as "in view"
				threshold: 0,
			},
		);

		// Observe only headings that are actually represented in the TOC
		this.tocElement
			.querySelectorAll('.toc-nav a[href^="#"]')
			.forEach((link) => {
				const id = link.getAttribute("href").slice(1);
				const heading = document.getElementById(id);
				if (heading) {
					observer.observe(heading);
				}
			});
	}

	/**
	 * Set the active link in TOC based on current scroll position
	 */
	setActiveLink(headingId) {
		// Remove active class from all links
		this.tocElement.querySelectorAll(".toc-nav a").forEach((link) => {
			link.classList.remove("is-active");
		});

		// Add active class to the current heading's link
		const activeLink = this.tocElement.querySelector(
			`.toc-nav a[href="#${headingId}"]`,
		);
		if (activeLink) {
			activeLink.classList.add("is-active");

			// Keep the active entry visible when the TOC itself has overflow.
			const navRect = this.tocNav.getBoundingClientRect();
			const linkRect = activeLink.getBoundingClientRect();
			if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
				// Scroll only the TOC's own frame. `scrollIntoView()` can also move
				// the document viewport, which causes jumps during fast page scrolls.
				this.tocNav.scrollTop += linkRect.top - navRect.top;
			}
		}
	}
}

// TOC Wrapper: Creates the table of contents DOM structure
class TOCWrapper {
	constructor() {
		this.headings = [];
	}

	/**
	 * Check if a heading is wrapped in a non-post__mainEntry div
	 * (skip headings inside extra div wrappers, but keep headings in the post__mainEntry container)
	 */
	isHeadingWrappedInDiv(heading) {
		if (!heading.parentElement) return false;
		const parent = heading.parentElement;
		if (parent.tagName.toLowerCase() !== "div") return false;
		if (parent.classList.contains("post__mainEntry")) return false;
		return true;
	}

	/**
	 * Collect all h2+ headings from .post__mainEntry
	 */
	collectHeadings() {
		this.headings = [];
		const contentEntry = document.querySelector(".post__mainEntry");
		if (!contentEntry) return this.headings;

		const allHeadings = contentEntry.querySelectorAll("h2, h3, h4, h5, h6");
		let foundFirstH2 = false;

		for (let heading of allHeadings) {
			// Skip if wrapped in a div
			if (this.isHeadingWrappedInDiv(heading)) {
				continue;
			}

			// For h2, always include and mark that we've found the first one
			if (heading.tagName.toLowerCase() === "h2") {
				foundFirstH2 = true;
				this.headings.push(heading);
			}
			// For h3+ only include if we've already found an h2
			else if (foundFirstH2) {
				this.headings.push(heading);
			}
		}

		return this.headings;
	}

	/**
	 * Ensure each heading has a unique ID
	 */
	ensureHeadingIds() {
		this.headings.forEach((heading, index) => {
			if (!heading.id) {
				heading.id = `heading-${index}`;
			}
		});
	}

	/**
	 * Get the heading level (2-6) for proper nesting
	 */
	getHeadingLevel(heading) {
		return parseInt(heading.tagName.toLowerCase().substring(1), 10);
	}

	/**
	 * Create the TOC list structure
	 */
	createTocList() {
		const ul = document.createElement("ul");

		if (this.headings.length === 0) {
			return ul;
		}

		let currentLevel = this.getHeadingLevel(this.headings[0]);
		let currentList = ul;
		const listStack = [{ level: currentLevel, list: ul }];

		this.headings.forEach((heading) => {
			const headingLevel = this.getHeadingLevel(heading);
			const targetLevel = Math.min(headingLevel, currentLevel + 1);

			// If going deeper, create nested lists
			while (targetLevel > currentLevel) {
				const newList = document.createElement("ul");
				if (currentList.lastElementChild) {
					currentList.lastElementChild.appendChild(newList);
				} else {
					currentList
						.appendChild(document.createElement("li"))
						.appendChild(newList);
				}
				currentList = newList;
				currentLevel++;
				listStack.push({ level: currentLevel, list: newList });
			}

			// If going back up, pop from stack
			while (headingLevel < currentLevel && listStack.length > 1) {
				listStack.pop();
				currentList = listStack[listStack.length - 1].list;
				currentLevel = listStack[listStack.length - 1].level;
			}

			// Create the list item with link
			const li = document.createElement("li");
			const a = document.createElement("a");
			a.href = `#${heading.id}`;
			a.textContent = heading.textContent;
			li.appendChild(a);
			currentList.appendChild(li);
		});

		return ul;
	}

	/**
	 * Create the complete TOC DOM structure
	 */
	createTocStructure() {
		// Create wrapper
		const wrapper = document.createElement("aside");
		wrapper.className = "toc-wrapper";
		wrapper.setAttribute("aria-label", "Table of Contents");

		// Create header with toggle button
		const header = document.createElement("div");
		header.className = "toc-header";

		const title = document.createElement("h3");
		title.className = "toc-title";
		title.textContent = "Table of Contents";
		header.appendChild(title);

		const toggleBtn = document.createElement("button");
		toggleBtn.type = "button";
		toggleBtn.className = "toc-toggle";
		toggleBtn.setAttribute("aria-label", "Toggle table of contents");
		toggleBtn.setAttribute("aria-expanded", "true");
		toggleBtn.innerHTML = '<span class="toc-toggle-icon">✕</span>';
		header.appendChild(toggleBtn);

		wrapper.appendChild(header);

		// Create nav with TOC list
		const nav = document.createElement("nav");
		nav.className = "toc-nav";
		const tocList = this.createTocList();
		nav.appendChild(tocList);

		wrapper.appendChild(nav);

		return wrapper;
	}

	/**
	 * Insert the TOC into the main content
	 */
	insertToc() {
		const contentEntry = document.querySelector(".post__mainInner");
		if (!contentEntry) return null;

		const tocStructure = this.createTocStructure();

		// Preferred: insert outside .post__mainInner, as sibling to that wrapper inside .content
		const contentInner = contentEntry.closest(".post__mainInner");
		if (contentInner) {
			const content = contentInner.closest(".post__mainContent");
			if (content) {
				content.insertBefore(tocStructure, contentInner);
				return tocStructure;
			}
		}

		// Fallback 1: insert as sibling before .content__entry inside .post__mainInner
		const wrapperParent = contentEntry.parentElement;
		if (wrapperParent && wrapperParent.classList.contains("post__mainInner")) {
			wrapperParent.insertBefore(tocStructure, contentEntry);
			return tocStructure;
		}

		// Fallback 2: place inside contentEntry as last resort
		contentEntry.insertBefore(tocStructure, contentEntry.firstChild);
		return tocStructure;
	}

	/**
	 * Full initialization
	 */
	init() {
		this.collectHeadings();

		if (this.headings.length === 0) {
			return null;
		}

		this.ensureHeadingIds();
		const toc = this.insertToc();

		return toc;
	}
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTOC);
} else {
    // DOM is already loaded
    initializeTOC();
}

// easter egg xD
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