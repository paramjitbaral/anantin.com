"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAllCoupons() {
    try {
        if (!process.env.DATABASE_URL) return []

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        })
        
        return coupons.map(c => ({
            ...c,
            expiresAt: c.expiresAt.toISOString(),
            createdAt: c.createdAt.toISOString()
        }))
    } catch (error) {
        console.error("Error fetching coupons:", error)
        return []
    }
}

export async function createCoupon(data) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        const newCoupon = await prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                description: data.description,
                discount: parseFloat(data.discount),
                forNewUser: data.forNewUser === 'true' || data.forNewUser === true,
                forMember: data.forMember === 'true' || data.forMember === true,
                isPublic: data.isPublic === 'true' || data.isPublic === true,
                expiresAt: new Date(data.expiresAt)
            }
        })
        
        revalidatePath('/admin/coupons')
        return { success: true, coupon: newCoupon }
    } catch (error) {
        console.error("Error creating coupon:", error)
        // Check for unique constraint violation on ID (code)
        if (error.code === 'P2002') {
            return { success: false, error: "Coupon code already exists" }
        }
        return { success: false, error: "Failed to create coupon" }
    }
}

export async function deleteCoupon(code) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        await prisma.coupon.delete({
            where: { code }
        })
        
        revalidatePath('/admin/coupons')
        return { success: true }
    } catch (error) {
        console.error("Error deleting coupon:", error)
        return { success: false, error: "Failed to delete coupon" }
    }
}

export async function validateCoupon(code) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        })
        
        if (!coupon) {
            return { success: false, error: "Invalid promo code" }
        }

        if (new Date() > coupon.expiresAt) {
            return { success: false, error: "This promo code has expired" }
        }

        return { 
            success: true, 
            coupon: {
                ...coupon,
                expiresAt: coupon.expiresAt.toISOString(),
                createdAt: coupon.createdAt.toISOString()
            } 
        }
    } catch (error) {
        console.error("Error validating coupon:", error)
        return { success: false, error: "Error verifying code" }
    }
}
