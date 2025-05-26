// utils/analyseSeoContent.js

export const analyseSeoContent = async ({
    content,
    editorJson,
    queryID,
    user,
    data,
    setGraphLineData,
    setDetectedCategories,
    setSoseoScore,
    setDseoScore
}) => {
    try {
        const keywords = data?.optimizationLevels?.map(item => item.keyword) || [];

        const optimizationRes = await fetch("/api/calculate_optimization_levels", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentText: [content], keywords }),
        });

        const { success, keywordOptimizations } = await optimizationRes.json();

        if (!success || !Array.isArray(keywordOptimizations)) {
            console.warn("Optimization failed");
            return;
        }

        const newGraphLineData = [
            {
                name: "Series 1",
                data: keywordOptimizations.map((opt) => ({
                    name: opt.keyword,
                    value: opt.value,
                })),
            },
        ];

        setGraphLineData(newGraphLineData);

        await fetch("/api/save_optimization_graph_data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                queryID,
                graphLineData: newGraphLineData
            }),
        });

        const categoryRes = await fetch("/api/generate_seo_category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, email: user.email, queryID }),
        });

        const { category } = await categoryRes.json();
        if (category) {
            setDetectedCategories(category.split(',').map((c) => c.trim()));
        }

        const soseoDseoRes = await fetch("/api/calculate_soseo_dseo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                keywords,
                processedDocs: [content.split(/\s+/)],
            }),
        });

        const soseoDseo = await soseoDseoRes.json();
        if (soseoDseo.success) {
            const soseo = Math.round(soseoDseo.soseo.reduce((a, b) => a + b, 0));
            const dseo = Math.round(soseoDseo.dseo.reduce((a, b) => a + b, 0));
            setSoseoScore(soseo);
            setDseoScore(dseo);

            await fetch("/api/save_soseo_dseo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, queryID, soseo, dseo }),
            });
        }

        await fetch("/api/save_seo_editor_data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                queryID,
                content: JSON.stringify(editorJson),
            }),
        });

    } catch (err) {
        console.error("Error in analyseSeoContent:", err);
    }
};
