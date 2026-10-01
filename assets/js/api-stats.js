const wikis = [
    {
        name: "Zombies vs Humans",
        apiUrl: "https://zombies-vs-humans.wiki/api.php",
        prefix: "zvh"
    },
    {
        name: "10 Player Flee",
        apiUrl: "https://10playerflee.wiki/api.php",
        prefix: "flee"
    },
    {
        name: "Forsaken",
        apiUrl: "https://forsaken.wiki/api.php",
        prefix: "forsaken"
    }
];

async function fetchWikiStats(wiki) {
    const targetUrl = `${wiki.apiUrl}?action=query&meta=siteinfo&siprop=statistics&format=json`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.query || !data.query.statistics) {
            throw new Error("Invalid response structure");
        }

        const stats = data.query.statistics;

        const articlesEl = document.getElementById(`${wiki.prefix}-articles`);
        const editsEl = document.getElementById(`${wiki.prefix}-edits`);
        const activeEl = document.getElementById(`${wiki.prefix}-active`);

        if (articlesEl) articlesEl.textContent = stats.articles.toLocaleString();
        if (editsEl) editsEl.textContent = stats.edits.toLocaleString();
        if (activeEl) activeEl.textContent = stats.activeusers.toLocaleString();
    } catch (error) {
        console.error(`Error fetching stats for ${wiki.name}:`, error);

        const articlesEl = document.getElementById(`${wiki.prefix}-articles`);
        const editsEl = document.getElementById(`${wiki.prefix}-edits`);
        const activeEl = document.getElementById(`${wiki.prefix}-active`);

        if (articlesEl) articlesEl.textContent = "Error";
        if (editsEl) editsEl.textContent = "Error";
        if (activeEl) activeEl.textContent = "Error";
    }
}

async function loadAllWikiStats() {
    await Promise.all(wikis.map(wiki => fetchWikiStats(wiki)));
}

document.addEventListener("DOMContentLoaded", loadAllWikiStats);