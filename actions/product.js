"use server"

import prisma from "@/lib/prisma"

/**
 * Fetch all products from the database, including the store details and ratings.
 */
export async function getAllProducts() {
    try {
        if (!process.env.DATABASE_URL) return []

        const products = await prisma.product.findMany({
            include: {
                store: true,
                rating: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return JSON.parse(JSON.stringify(products))
    } catch (error) {
        console.error("Error fetching all products:", error)
        return []
    }
}

/**
 * Seed dummy products into the database. (Temporary for migration)
 */
import { productDummyData } from "@/assets/assets"

export async function seedDummyProducts() {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" }

        // Clear existing products first to avoid duplicates
        await prisma.product.deleteMany({})

        // Fetch top 2 stores
        const stores = await prisma.store.findMany({ take: 2 })
        if (stores.length < 2) {
            return { success: false, error: "Need at least 2 stores in DB to split products evenly." }
        }

        const store1Id = stores[0].id
        const store2Id = stores[1].id

        let count = 0
        for (let i = 0; i < productDummyData.length; i++) {
            const product = productDummyData[i]
            // Assign first 6 to store 1, next 6 to store 2
            const targetStoreId = i < 6 ? store1Id : store2Id

            // Use the static public URLs we just copied
            const images = [ `/products/product_img${i + 1}.png` ]

            await prisma.product.create({
                data: {
                    name: product.name,
                    description: product.description,
                    mrp: parseFloat(product.mrp),
                    price: parseFloat(product.price),
                    images: images,
                    category: product.category,
                    colors: product.colors || [],
                    gsm: product.gsm || null,
                    width: product.width || null,
                    material: product.material || null,
                    availableStock: product.availableStock || 0,
                    storeId: targetStoreId,
                    // Note: Skipping ratings relation creation for simplicity of products seed
                }
            })
            count++
        }

        return { success: true, count }
    } catch (error) {
        console.error("Error seeding products:", error)
        return { success: false, error: error.message }
    }
}
