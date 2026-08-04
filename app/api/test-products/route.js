import { getAllProducts } from '@/actions/product';
import { NextResponse } from 'next/server';

export async function GET() {
    const products = await getAllProducts();
    return NextResponse.json({ count: products.length, categories: products.map(p => p.category) });
}
