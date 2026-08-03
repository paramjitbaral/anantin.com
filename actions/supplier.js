"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Temporary helper to get the "logged in" store ID.
 * In a real app with Clerk/NextAuth, you would extract this from the session.
 */
export async function getDemoStoreId() {
    try {
        if (!process.env.DATABASE_URL) return null;
        const store = await prisma.store.findFirst()
        return store ? store.id : null
    } catch (error) {
        console.error("Error fetching demo store:", error)
        return null
    }
}

/**
 * Create a new store application (mock user created for now)
 */
export async function createStore(storeData) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        // Find or create a dummy user to associate with this store
        let user = await prisma.user.findFirst()
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: "dummy-user-" + Date.now(),
                    name: "Dummy User",
                    email: storeData.email || "dummy@example.com",
                    image: "https://via.placeholder.com/150",
                }
            })
        }

        // Check if store already exists for this user
        const existingStore = await prisma.store.findUnique({
            where: { userId: user.id }
        })

        if (existingStore) {
            return { success: false, error: "You already have a store account." }
        }

        const newStore = await prisma.store.create({
            data: {
                userId: user.id,
                name: storeData.name,
                username: storeData.username,
                description: storeData.description,
                address: storeData.address,
                logo: storeData.logo || "https://via.placeholder.com/150",
                email: storeData.email,
                contact: storeData.contact,
                status: "pending",
                isActive: false
            }
        })
        
        revalidatePath('/create-store')
        revalidatePath('/admin')
        return { success: true, store: newStore }

    } catch (error) {
        console.error("Error creating store:", error)
        return { success: false, error: "Failed to create store. Username might be taken." }
    }
}

/**
 * Fetches overall metrics for the Supplier Dashboard.
 */
export async function getStoreDashboardData(storeId) {
    if (!storeId || !process.env.DATABASE_URL) return null

    try {
        const products = await prisma.product.count({ where: { storeId } })
        
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: { orderItems: true }
        })

        const totalOrders = orders.length
        const totalEarnings = orders
            .filter(o => o.isPaid || o.status === 'DELIVERED')
            .reduce((sum, order) => sum + order.total, 0)

        // Fetch recent ratings for this store's products
        const recentRatings = await prisma.rating.findMany({
            where: { product: { storeId } },
            include: { user: true, product: true },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        return {
            totalProducts: products,
            totalEarnings: totalEarnings,
            totalOrders: totalOrders,
            ratings: recentRatings
        }
    } catch (error) {
        console.error("Error fetching supplier dashboard data:", error)
        throw new Error("Failed to load dashboard data")
    }
}

/**
 * Fetches all products for a given store.
 */
export async function getStoreProducts(storeId) {
    if (!storeId || !process.env.DATABASE_URL) return []

    try {
        const products = await prisma.product.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        })
        return products
    } catch (error) {
        console.error("Error fetching supplier products:", error)
        return []
    }
}

/**
 * Updates a product's available stock.
 */
export async function updateProductStock(productId, newStock) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" };

        await prisma.product.update({
            where: { id: productId },
            data: { availableStock: parseInt(newStock) }
        })
        revalidatePath('/store/manage-product')
        return { success: true }
    } catch (error) {
        console.error("Error updating stock:", error)
        return { success: false, error: "Failed to update stock" }
    }
}

/**
 * Deletes a product.
 */
export async function deleteProduct(productId) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" };

        await prisma.product.delete({
            where: { id: productId }
        })
        revalidatePath('/store/manage-product')
        return { success: true }
    } catch (error) {
        console.error("Error deleting product:", error)
        return { success: false, error: "Failed to delete product" }
    }
}

/**
 * Adds a new product to the store.
 */
export async function addProduct(storeId, productData) {
    if (!storeId) throw new Error("Store ID required")

    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" };

        const newProduct = await prisma.product.create({
            data: {
                storeId,
                name: productData.name,
                description: productData.description,
                mrp: parseFloat(productData.mrp),
                price: parseFloat(productData.price),
                category: productData.category,
                availableStock: parseInt(productData.stock || 0),
                images: productData.images || [], // Array of URLs
                colors: productData.colors || [],
                gsm: productData.gsm || null,
                width: productData.width || null,
                material: productData.material || null,
            }
        })
        revalidatePath('/store/manage-product')
        return { success: true, product: newProduct }
    } catch (error) {
        console.error("Error adding product:", error)
        return { success: false, error: "Failed to add product" }
    }
}

/**
 * Fetches all orders directed to this store.
 */
export async function getStoreOrders(storeId) {
    if (!storeId || !process.env.DATABASE_URL) return []

    try {
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: {
                user: true,
                address: true,
                orderItems: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return orders
    } catch (error) {
        console.error("Error fetching supplier orders:", error)
        return []
    }
}

/**
 * Updates an order's status (e.g. PROCESSING, SHIPPED, DELIVERED).
 */
export async function updateOrderStatus(orderId, status) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" };

        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })
        revalidatePath('/store/orders')
        return { success: true }
    } catch (error) {
        console.error("Error updating order status:", error)
        return { success: false, error: "Failed to update order status" }
    }
}
