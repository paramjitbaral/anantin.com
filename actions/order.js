"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

/**
 * Places an order using the items in the cart
 * This assumes the user is logged in, but since we don't have a full auth system, 
 * we'll create a dummy user or use a hardcoded one for now to satisfy Prisma constraints.
 */
export async function placeOrder(orderData) {
    try {
        if (!process.env.DATABASE_URL) return { success: false, error: "Database not configured" };

        const { items, address, paymentMethod, coupon, total, userId } = orderData;

        if (!items || items.length === 0) {
            return { success: false, error: "Cart is empty" };
        }
        if (!address) {
            return { success: false, error: "Address is required" };
        }

        let user;
        if (userId) {
            user = await prisma.user.findUnique({ where: { id: userId } });
        }
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId || "guest-user-" + Date.now(),
                    name: address.name || "Guest User",
                    email: address.email || "guest@example.com",
                    image: "/shop icon.png"
                }
            });
        }

        // Reuse existing address if it exists, otherwise create it in the DB
        let dbAddress = null;
        if (address.id) {
            dbAddress = await prisma.address.findUnique({ where: { id: address.id } });
        }

        if (!dbAddress) {
            dbAddress = await prisma.address.create({
                data: {
                    userId: user.id,
                    name: address.name,
                    email: address.email,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip: String(address.zip),
                    country: address.country,
                    phone: String(address.phone)
                }
            });
        }

        // We need to group items by storeId because an order in our schema belongs to ONE store.
        // If a cart has items from multiple stores, we have to create multiple orders.
        const storeGroups = {};
        for (const item of items) {
            if (!storeGroups[item.storeId]) {
                storeGroups[item.storeId] = [];
            }
            storeGroups[item.storeId].push(item);
        }

        const createdOrders = [];

        // Run this in a transaction if possible, but loop is fine for MVP
        for (const [storeId, storeItems] of Object.entries(storeGroups)) {
            
            // Calculate total for this specific store's items
            let storeTotal = storeItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
            
            // Apply coupon proportionally or fully to the first store order
            let storeCoupon = null;
            let isCouponUsed = false;
            
            if (coupon && coupon.code) {
                isCouponUsed = true;
                storeCoupon = coupon;
                storeTotal = storeTotal - (storeTotal * (coupon.discount / 100));
            }

            // Verify stock
            for (const item of storeItems) {
                const dbProduct = await prisma.product.findUnique({ where: { id: item.id } });
                if (!dbProduct || dbProduct.availableStock < item.quantity) {
                    return { success: false, error: `Not enough stock for ${item.name}` };
                }
            }

            // Create Order
            const newOrder = await prisma.order.create({
                data: {
                    total: storeTotal,
                    status: 'ORDER_PLACED',
                    userId: user.id,
                    storeId: storeId,
                    addressId: dbAddress.id,
                    paymentMethod: paymentMethod,
                    isPaid: paymentMethod === 'STRIPE' ? true : false,
                    isCouponUsed: isCouponUsed,
                    coupon: storeCoupon || {},
                    orderItems: {
                        create: storeItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            // Deduct Stock
            for (const item of storeItems) {
                await prisma.product.update({
                    where: { id: item.id },
                    data: {
                        availableStock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            createdOrders.push(newOrder);
        }

        revalidatePath('/orders')
        revalidatePath('/store/orders')
        revalidatePath('/admin')
        return { success: true, orders: createdOrders }
        
    } catch (error) {
        console.error("Error placing order:", error)
        return { success: false, error: error.message || "Failed to place order" }
    }
}
