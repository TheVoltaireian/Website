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
    const params = new URLSearchParams({
        action: "query",
        meta: "siteinfo",
        siprop: "statistics",
        format: "json",
        origin: "*"
    });

    try {
        const response = await fetch(`${wiki.apiUrl}?${params.toString()}`);
        if (!response.ok) throw new Error("Network error");
        
        const data = await response.json();
        const stats = data.query.statistics;

        document.getElementById(`${wiki.prefix}-articles`).textContent = stats.articles.toLocaleString();
        document.getElementById(`${wiki.prefix}-edits`).textContent = stats.edits.toLocaleString();
        document.getElementById(`${wiki.prefix}-active`).textContent = stats.activeusers.toLocaleString();
    } catch (error) {
        console.error(`Error fetching stats for ${wiki.name}:`, error);
        document.getElementById(`${wiki.prefix}-articles`).textContent = "Error";
        document.getElementById(`${wiki.prefix}-edits`).textContent = "Error";
        document.getElementById(`${wiki.prefix}-active`).textContent = "Error";
    }
}

async function loadAllWikiStats() {
    await Promise.all(wikis.map(wiki => fetchWikiStats(wiki)));
}

document.addEventListener("DOMContentLoaded", loadAllWikiStats);