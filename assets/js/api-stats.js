async function loadAllWikiStats() {
    try {
        const response = await fetch('/assets/json/stats.json');
        if (!response.ok) throw new Error("Could not load /assets/json/stats.json");

        const data = await response.json();

        const prefixes = ['zvh', 'flee', 'forsaken'];

        prefixes.forEach(prefix => {
            if (data[prefix]) {
                const stats = data[prefix];
                const articlesEl = document.getElementById(`${prefix}-articles`);
                const editsEl = document.getElementById(`${prefix}-edits`);
                const activeEl = document.getElementById(`${prefix}-active`);

                if (articlesEl) articlesEl.textContent = stats.articles.toLocaleString();
                if (editsEl) editsEl.textContent = stats.edits.toLocaleString();
                if (activeEl) activeEl.textContent = stats.activeusers.toLocaleString();
            }
        });
    } catch (error) {
        console.error("Error loading cached wiki stats:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadAllWikiStats);