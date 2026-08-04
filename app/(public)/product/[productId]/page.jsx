'use client'
import ProductDescription from "@/components/ProductDescription";
import Link from 'next/link';
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumbs */}
                <div className="text-[#8C8A85] text-sm mt-8 mb-5 font-medium flex items-center gap-1.5">
                    <Link href="/" className="hover:text-[#2C241B] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#2C241B] transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-[#2C241B]">{product?.category}</span>
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews (Mobile Only) */}
                {product && (
                    <div className="lg:hidden">
                        <ProductDescription product={product} />
                    </div>
                )}
            </div>
        </div>
    );
}