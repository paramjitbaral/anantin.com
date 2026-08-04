'use server'

import prisma from '@/lib/prisma'

export async function getAdminDashboardData() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not configured. Failing fast to prevent timeout.")
        }
        
        const [productsCount, ordersCount, storesCount, allOrders] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.store.count(),
            prisma.order.findMany({
                select: {
                    createdAt: true,
                    total: true,
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })
        ])

        // Calculate total revenue from all orders
        // Typically revenue might only count DELIVERED orders, but we'll sum all for now.
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)

        // Convert dates to string so they can be passed to the Client Component
        const formattedOrders = allOrders.map(order => ({
            createdAt: order.createdAt.toISOString(),
            total: order.total
        }))

        return {
            products: productsCount,
            orders: ordersCount,
            stores: storesCount,
            revenue: totalRevenue.toFixed(2),
            allOrders: formattedOrders
        }

    } catch (error) {
        console.error("Error fetching admin dashboard data:", error)
        // Return fallback/empty data so the UI doesn't crash completely
        return {
            products: 0,
            orders: 0,
            stores: 0,
            revenue: '0.00',
            allOrders: []
        }
    }
}

export async function getAllStores() {
    try {
        if (!process.env.DATABASE_URL) {
            return [] // Fail fast if no DB
        }
        
        const stores = await prisma.store.findMany({
            include: {
                user: true // To get applicant details
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        // Convert Dates to strings for the Client Component
        return stores.map(store => ({
            ...store,
            createdAt: store.createdAt.toISOString(),
            updatedAt: store.updatedAt.toISOString(),
            user: {
                ...store.user,
                // In a real app we might not want to send all user data, but we need name and image
            }
        }))
    } catch (error) {
        console.error("Error fetching all stores:", error)
        return []
    }
}

export async function toggleStoreActiveStatus(storeId, currentStatus) {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not configured.")
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { isActive: !currentStatus }
        })

        return { success: true, store: updatedStore }
    } catch (error) {
        console.error("Error toggling store status:", error)
        return { success: false, error: error.message }
    }
}

export async function updateStoreStatus(storeId, newStatus) {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not configured.")
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { status: newStatus }
        })

        return { success: true, store: updatedStore }
    } catch (error) {
        console.error("Error updating store status:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteStoreById(storeId) {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not configured.")
        }

        await prisma.store.delete({
            where: { id: storeId }
        })

        return { success: true }
    } catch (error) {
        console.error("Error deleting store:", error)
        return { success: false, error: error.message }
    }
}
