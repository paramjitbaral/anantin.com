"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUserOrders(userId) {
    if (!userId || !process.env.DATABASE_URL) return []

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                address: true,
                user: { select: { name: true, email: true } },
                orderItems: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const ratings = await prisma.rating.findMany({
            where: { orderId: { in: orders.map(o => o.id) } },
            select: { orderId: true, rating: true }
        })
        const orderRatings = {}
        ratings.forEach(r => {
            if (!orderRatings[r.orderId]) {
                orderRatings[r.orderId] = []
            }
            orderRatings[r.orderId].push(r.rating)
        })

        return orders.map(order => ({
            ...order,
            hasReviewed: !!orderRatings[order.id],
            avgRating: orderRatings[order.id] ? Math.round(orderRatings[order.id].reduce((a, b) => a + b, 0) / orderRatings[order.id].length) : null
        }))
    } catch (error) {
        console.error("Error fetching user orders:", error)
        return []
    }
}

export async function getUserAddresses(userId) {
    if (!userId || !process.env.DATABASE_URL) return []

    try {
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
        return addresses
    } catch (error) {
        console.error("Error fetching user addresses:", error)
        return []
    }
}

export async function addAddress(userId, addressData) {
    if (!userId || !process.env.DATABASE_URL) return { success: false, error: "Database not configured or user not logged in." }

    try {
        // Ensure user exists (in case they signed up via Supabase but don't exist in Prisma User table yet)
        let user = await prisma.user.findUnique({ where: { id: userId } })
        
        if (!user) {
            // Need to fetch user from Supabase or rely on provided data. We'll rely on provided data from the client
            user = await prisma.user.create({
                data: {
                    id: userId,
                    name: addressData.name,
                    email: addressData.email,
                    image: "/shop icon.png"
                }
            })
        }

        const newAddress = await prisma.address.create({
            data: {
                userId,
                name: addressData.name,
                email: addressData.email,
                street: addressData.street,
                city: addressData.city,
                state: addressData.state,
                zip: String(addressData.zip),
                country: addressData.country,
                phone: String(addressData.phone)
            }
        })
        
        return { success: true, address: newAddress }
    } catch (error) {
        console.error("Error adding address:", error)
        return { success: false, error: "Failed to add address" }
    }
}
