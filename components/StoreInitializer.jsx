'use client'

import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setProduct } from '@/lib/features/product/productSlice'

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
