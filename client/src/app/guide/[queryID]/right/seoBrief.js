// function parseSeoBrief(briefString) {
//     const parsedBrief = {};

//     // Regular expression to match sections like "Primary Intent", "Objective", etc.
//     const sectionsRegex = /(\d+)\.\s*\*\*(.*?)\*\*:\s*-\s*(.*?)(?=\d+\.\s|\n|$)/gs;

//     let match;
//     while ((match = sectionsRegex.exec(briefString)) !== null) {
//         const key = match[2].toLowerCase().replace(/\s+/g, ''); // Normalize the key
//         const value = match[3].trim(); // Clean up the value
//         parsedBrief[key] = value;
//     }

//     return parsedBrief;
// }


export default function SeoBrief({data}){

    const { seoBrief } = data;

    // const parsedSeoBrief =parseSeoBrief(seoBrief);

    // const {
    //     primaryintent,
    //     objective,
    //     maintopicstocover,
    //     importantquestions,
    //     writingstyleandtone,
    //     recommendedstyle,
    //     valueproposition
    // } = parsedSeoBrief;

    // console.log(maintopicstocover)

    // Split the objective into sentences based on periods (.)
    // const objectiveSentences = objective.split('.').filter(sentence => sentence.trim() !== "");
    // const mainTopics = maintopicstocover
    //     .split('\n')
    //     .map((line) => line.trim()) // Trim extra spaces
    //     .filter((line) => line.length > 0) // Remove empty lines
    //     .map((line) => line.replace(/^-/, '').trim()); // Remove the leading "-" and trim spaces

    return(
        <div>
            <div className="font-semibold text-sm">Context and Objective:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Primary Intent:</div>
            {/* <div className="ml-20 mt-3 text-gray-900 text-sm">{primaryintent}</div> */}
            <div className="ml-10 mt-3 text-gray-400 text-sm">Objective:</div>
            {/* <div className="ml-20 mt-2 text-gray-900">
                {objectiveSentences.map((sentence, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-1">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="flex-grow text-sm">
                            {sentence.trim()}.
                        </div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3">Main Topics to Cover:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Key Subjects:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {mainTopics.map((topic, index) => (
                    <div key={index} className="inline-flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="leading-tight">
                            {topic}
                        </div>
                    </div>
                ))}
            </div> */}



        </div>
    )
}