'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersAreaChart({ allOrders }) {

    // Generate the last 14 days for a professional timeline look
    const last14Days = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (13 - i))
        return d.toISOString().split('T')[0]
    })

    // Group orders by date
    const ordersPerDay = allOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})

    // Map the 14 days, filling in 0 for missing days
    const chartData = last14Days.map(date => ({
        date: date.substring(5), // Format as MM-DD for a cleaner axis
        orders: ordersPerDay[date] || 0
    }))

    return (
        <div className="w-full h-[320px] -ml-6 -mb-4">
            <ResponsiveContainer width="100%" height="100%"> 
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#bda27e" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#8b795a" tick={{fill: '#8b6b3d', fontSize: 10, fontFamily: 'serif'}} />
                    <YAxis allowDecimals={false} stroke="#8b795a" tick={{fill: '#8b6b3d', fontSize: 10, fontFamily: 'serif'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1E1914', borderColor: '#D4B26F', borderRadius: '4px', color: '#D4B26F', fontFamily: 'serif'}} itemStyle={{color: '#EAE5DB'}} />
                    <Area type="monotone" dataKey="orders" stroke="#8b6b3d" fill="#D4B26F" strokeWidth={3} fillOpacity={0.6} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
