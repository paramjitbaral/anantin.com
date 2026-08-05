'use client'

import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setProduct } from '@/lib/features/product/productSlice'

// Globally silence all runtime console outputs for a clean browser console
if (typeof window !== 'undefined') {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
    
    // Only silence console.error on the deployed server, keep it visible for local development
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        console.error = () => {};
    }
}

export default function StoreInitializer({ products }) {
    const dispatch = useDispatch()
    const initialized = useRef(false)

    if (!initialized.current) {
        if (products && products.length > 0) {
            dispatch(setProduct(products))
        }
        initialized.current = true
    }

    return null
}
