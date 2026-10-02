document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Append timestamp query parameter to bypass browser caching
        const res = await fetch(`/assets/json/stats.json?t=${Date.now()}`);
        if (!res.ok) throw new Error("Could not load stats.json");

        const data = await res.json();
        console.log("Loaded JSON stats:", data);

        const wikis = ["zvh", "flee", "forsaken"];

        wikis.forEach((wiki) => {
            const stats = data[wiki];
            if (stats) {
                const articlesEl = document.getElementById(`${wiki}-articles`);
                const editsEl = document.getElementById(`${wiki}-edits`);
                const activeEl = document.getElementById(`${wiki}-active`);

                if (articlesEl) articlesEl.innerText = (stats.articles ?? 0).toLocaleString();
                if (editsEl) editsEl.innerText = (stats.edits ?? 0).toLocaleString();
                if (activeEl) activeEl.innerText = (stats.activeusers ?? 0).toLocaleString();
            }
        });
    } catch (err) {
        console.error("Error populating wiki stats:", err);
    }
});