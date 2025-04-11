export default function SerpEvolutionTable({ data }) {
    if (!data?.length) return null;

    return (
        <div className="w-full">
            <div className="text-md font-semibold justify-start flex mb-10 text-gray-500">SERP history : Data from {new Date().toISOString().split("T")[0]}</div>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                    <th className="px-2 py-2">Position</th>
                    <th className="px-2 py-2">Url</th>
                    <th className="px-2 py-2 text-right">Evolution</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ title, link, currentPosition, change }, i) => (
                    <tr key={link} className="border-t border-gray-200">
                        <td className="px-2 py-1">{currentPosition}</td>
                        <td className="px-2 py-1">
                        <div className="text-sm font-medium">{title}</div>
                        <a href={link} target="_blank" rel="noreferrer" className="text-blue-500 text-xs truncate inline-block max-w-[350px]">{link}</a>
                        </td>
                        <td className="px-2 py-1 text-right text-xs font-semibold">
                        {change > 0 && <span className="text-green-600">↑ {change}</span>}
                        {change < 0 && <span className="text-red-600">↓ {Math.abs(change)}</span>}
                        {change === 0 && <span className="text-gray-500">0</span>}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
