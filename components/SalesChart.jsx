"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SalesChart({ data }) {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE5DB" opacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#8b795a', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#8b795a', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(value) => `₹${value}`}
                        dx={-10}
                    />
                    <Tooltip 
                        cursor={{ fill: '#FDFBF7' }}
                        contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            borderRadius: '8px',
                            border: '1px solid #EAE5DB',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            padding: '12px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#1a1510', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="revenue" fill="#1a1510" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
