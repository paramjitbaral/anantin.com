"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

/**
 * Get the currently logged in store ID from secure cookies.
 */
export async function getLoggedInStoreId() {
    try {
        const cookieStore = await cookies()
        const storeId = cookieStore.get('storeId')?.value
        return storeId || null
    } catch (error) {
        console.error("Error fetching logged in store:", error)
        return null
    }
}

/**
 * Get store details by ID
 */
export async function getStoreById(storeId) {
    if (!storeId || !process.env.DATABASE_URL) return null
    try {
        return await prisma.store.findUnique({ where: { id: storeId } })
    } catch (error) {
        return null
    }
}

/**
 * Get store details by Username
 */
export async function getStoreByUsername(username) {
    if (!username || !process.env.DATABASE_URL) return null
    try {
        return await prisma.store.findUnique({ 
            where: { username },
            include: { 
                Product: {
                    include: {
                        rating: true
                    }
                } 
            }
        })
    } catch (error) {
        return null
    }
}

/**
 * Login a supplier using their username and contact number (password).
 */
export async function supplierLogin(username, contact) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        const store = await prisma.store.findUnique({ where: { username } })
        
        if (!store) {
            return { success: false, error: 'Store not found' }
        }
        
        // Strip non-numeric characters and compare the last 10 digits
        const cleanStored = store.contact.replace(/\D/g, '')
        const cleanProvided = contact.replace(/\D/g, '')
        
        if (cleanStored.slice(-10) !== cleanProvided.slice(-10)) {
            return { success: false, error: 'Invalid credentials' }
        }
        
        if (store.status !== 'approved') {
            return { success: false, error: 'Store is pending admin approval.' }
        }

        // Set a secure HTTP-only cookie
        const cookieStore = await cookies()
        cookieStore.set('storeId', store.id, { httpOnly: true, secure: true, path: '/' })
        return { success: true, store }
    } catch (error) {
        console.error("Error logging in store:", error)
        return { success: false, error: "Failed to log in" }
    }
}

/**
 * Log out a supplier by clearing the secure cookie.
 */
export async function supplierLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('storeId')
    return { success: true }
}

/**
 * Create a new store application (mock user created for now)
 */
export async function createStore(storeData) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        // Create a new dummy user to satisfy the foreign key constraint
        const user = await prisma.user.create({
            data: {
                id: "store-owner-" + Date.now() + Math.floor(Math.random() * 1000),
                name: storeData.name || "Store Owner",
                email: storeData.email || "dummy@example.com",
                image: "/shop icon.png",
            }
        })

        const newStore = await prisma.store.create({
            data: {
                userId: user.id,
                name: storeData.name,
                username: storeData.username,
                description: storeData.description,
                address: storeData.address,
                logo: storeData.logo || "/shop icon.png",
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
        return { success: false, error: error.message || "Failed to create store. Username might be taken." }
    }
}

/**
 * Fetches overall metrics for the Supplier Dashboard.
 */
export async function getStoreDashboardData(storeId, view = 'monthly') {
    if (!storeId || !process.env.DATABASE_URL) return null

    try {
        const currentDate = new Date();
        let startDate = new Date();
        
        if (view === 'daily') {
            startDate.setHours(currentDate.getHours() - 24);
        } else if (view === 'yearly') {
            startDate.setFullYear(currentDate.getFullYear() - 1);
        } else {
            // default to monthly
            startDate.setDate(currentDate.getDate() - 30);
        }

        const products = await prisma.product.count({ where: { storeId } })
        
        const orders = await prisma.order.findMany({
            where: { 
                storeId,
                createdAt: { gte: startDate }
            },
            include: { 
                orderItems: {
                    include: { product: true }
                },
                user: true 
            },
            orderBy: { createdAt: 'desc' }
        })

        const totalOrders = orders.length
        
        // Revenue calculations
        const validOrders = orders.filter(o => o.isPaid || o.status === 'DELIVERED')
        const totalEarnings = validOrders.reduce((sum, order) => sum + order.total, 0)
        
        // Calculate total unique customers
        const uniqueCustomerIds = new Set(orders.map(o => o.userId).filter(Boolean))
        const totalCustomers = uniqueCustomerIds.size

        // Calculate Sales Data for Chart based on view
        const salesData = [];
        
        if (view === 'daily') {
            // Last 24 hours grouped into 6 blocks of 4 hours
            for (let i = 5; i >= 0; i--) {
                const start = new Date(currentDate);
                start.setHours(start.getHours() - (i * 4) - 4);
                const end = new Date(currentDate);
                end.setHours(end.getHours() - (i * 4));
                salesData.push({
                    name: `${start.getHours()}:00`,
                    revenue: 0,
                    orders: 0,
                    start,
                    end
                });
            }
            validOrders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const block = salesData.find(d => orderDate >= d.start && orderDate <= d.end);
                if (block) {
                    block.revenue += order.total;
                    block.orders += 1;
                }
            });
        } else if (view === 'yearly') {
            // Last 12 months
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                salesData.push({
                    name: monthNames[d.getMonth()],
                    revenue: 0,
                    orders: 0,
                    month: d.getMonth(),
                    year: d.getFullYear()
                });
            }
            validOrders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const block = salesData.find(d => d.month === orderDate.getMonth() && d.year === orderDate.getFullYear());
                if (block) {
                    block.revenue += order.total;
                    block.orders += 1;
                }
            });
        } else {
            // Monthly view (last 30 days) - group by week or just 4 blocks
            for (let i = 4; i >= 1; i--) {
                const end = new Date(currentDate);
                end.setDate(end.getDate() - ((i - 1) * 7));
                const start = new Date(end);
                start.setDate(start.getDate() - 7);
                salesData.push({
                    name: `Week ${5 - i}`,
                    revenue: 0,
                    orders: 0,
                    start,
                    end
                });
            }
            validOrders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const block = salesData.find(d => orderDate >= d.start && orderDate <= d.end);
                if (block) {
                    block.revenue += order.total;
                    block.orders += 1;
                }
            });
        }

        // Top Products Calculation
        const productSales = {};
        validOrders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        product: item.product,
                        totalSold: 0,
                        revenue: 0
                    }
                }
                productSales[item.productId].totalSold += item.quantity;
                productSales[item.productId].revenue += (item.price * item.quantity);
            })
        });
        
        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent Transactions (Top 5)
        const recentTransactions = orders.slice(0, 5);

        // Fetch recent ratings for this store's products
        const recentRatings = await prisma.rating.findMany({
            where: { product: { storeId } },
            include: { user: true, product: true },
            orderBy: { createdAt: 'desc' },
            take: 5
        })

        return {
            totalProducts: products,
            totalEarnings,
            totalOrders,
            totalCustomers,
            ratings: recentRatings,
            salesData,
            recentTransactions,
            topProducts
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
 * Updates a product's price.
 */
export async function updateProductPrice(productId, newPrice) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" };

        await prisma.product.update({
            where: { id: productId },
            data: { price: parseFloat(newPrice) }
        })
        revalidatePath('/store/manage-product')
        return { success: true }
    } catch (error) {
        console.error("Error updating price:", error)
        return { success: false, error: "Failed to update price" }
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
