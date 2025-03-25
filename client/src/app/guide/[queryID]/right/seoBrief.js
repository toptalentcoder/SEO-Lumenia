import { FaRobot } from "react-icons/fa6";

export default function SeoBrief({data}){

    const { seoBrief } = data;

    const {
        primaryIntent,
        objective,
        mainTopics,
        importantQuestions,
        writingStyleAndTone,
        recommendedStyle,
        valueProposition,
    } = seoBrief;

    return(
        <div>
            <div className="font-semibold text-sm">Context and Objective:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Primary Intent:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">{primaryIntent}</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Objective:</div>
            <div className="ml-20 mt-2 text-gray-900">
                {objective.map((sentence, index) => (
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
                    <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="leading-tight">
                            {topic}
                        </div>
                    </div>
                ))}
            </div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Questions to Consider:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {importantQuestions.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="leading-tight">
                            {topic}
                        </div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3">Writing Style and Tone:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Recommended Tone:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {writingStyleAndTone.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="leading-tight">
                            {topic}
                        </div>
                    </div>
                ))}
            </div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Recommended Style:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {recommendedStyle.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="leading-tight">
                            {topic}.
                        </div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3">Value Proposition:</div>
            <div className="ml-10 mt-3 text-gray-900 text-sm">
                {valueProposition.map((topic, index) => (
                    <div key={index} className="inline-flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600  flex-shrink-0" />
                        <div className="leading-tight">
                            {topic}.
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="mt-10 flex justify-center items-center space-x-2 text-[#FFFFFF] bg-[#EBB71A] hover:bg-[#C29613] cursor-pointer mx-auto px-5 py-1 rounded-lg">
                <FaRobot/>
                <span>200</span>
                <span>-</span>
                <span>Verify Brief Items</span>
            </button>

        </div>
    )
}