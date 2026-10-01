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

function fetchWikiStatsJSONP(apiUrl) {
    return new Promise((resolve, reject) => {
        const callbackName = "wiki_cb_" + Math.random().toString(36).substring(2, 9);
        const script = document.createElement("script");

        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Request timed out"));
        }, 10000);

        function cleanup() {
            clearTimeout(timeout);
            delete window[callbackName];
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        }

        window[callbackName] = function(data) {
            cleanup();
            resolve(data);
        };

        script.onerror = function() {
            cleanup();
            reject(new Error("Failed to load script (network error)"));
        };

        script.src = `${apiUrl}?action=query&meta=siteinfo&siprop=statistics&format=json&callback=${callbackName}`;
        document.body.appendChild(script);
    });
}

async function fetchWikiStats(wiki) {
    try {
        const data = await fetchWikiStatsJSONP(wiki.apiUrl);
        
        if (!data || !data.query || !data.query.statistics) {
            throw new Error("Invalid API response format");
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