import { NextResponse } from "next/server"
import { seedDummyProducts } from "@/actions/product"

export async function GET() {
    const res = await seedDummyProducts()
    return NextResponse.json(res)
}
