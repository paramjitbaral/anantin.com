"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitReview(reviewData) {
    const { userId, productId, orderId, rating, review } = reviewData

    if (!userId || !productId || !orderId || !rating) {
        return { success: false, error: "Missing required fields" }
    }

    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        // Verify that the order exists, belongs to the user, and is DELIVERED
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        })

        if (!order || order.userId !== userId) {
            return { success: false, error: "Order not found or unauthorized" }
        }

        if (order.status !== 'DELIVERED') {
            return { success: false, error: "You can only review delivered orders" }
        }

        // Verify the user actually bought this product in this order
        const orderItem = await prisma.orderItem.findUnique({
            where: {
                orderId_productId: {
                    orderId: orderId,
                    productId: productId
                }
            }
        })

        if (!orderItem) {
            return { success: false, error: "Product not found in this order" }
        }

        // Check if review already exists
        const existingReview = await prisma.rating.findUnique({
            where: {
                userId_productId_orderId: {
                    userId,
                    productId,
                    orderId
                }
            }
        })

        if (existingReview) {
            return { success: false, error: "You have already reviewed this product for this order." }
        }

        // Create the review
        const newReview = await prisma.rating.create({
            data: {
                rating: parseInt(rating),
                review: review || "",
                userId: userId,
                productId: productId,
                orderId: orderId
            }
        })

        revalidatePath(`/shop/product/${productId}`)
        revalidatePath(`/profile`)
        revalidatePath(`/orders`)
        return { success: true, review: newReview }
    } catch (error) {
        console.error("Error submitting review:", error)
        return { success: false, error: "Failed to submit review" }
    }
}
