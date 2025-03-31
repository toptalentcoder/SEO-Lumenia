import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,  CartesianGrid } from 'recharts';

export default function PositionHistoryChart({ cronjob }) {
    if (!cronjob || cronjob.length === 0) return null;

    // Sort by date if needed
    const sorted = [...cronjob].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="w-full h-[600px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sorted}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} />
                    <XAxis
                        dataKey="date"
                        angle={45}
                        textAnchor="start"
                        tick={{ fontSize: 10 }}
                        height={50}/>
                    <YAxis
                        domain={[1, 25]}
                        reversed // ✅ top = 1st place
                        allowDecimals={false}
                        tickCount={25}
                        interval={0}
                        label={{
                        value: 'Position',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                        }}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="position" stroke="#413793" dot />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
