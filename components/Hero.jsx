'use client'
import React, { useEffect, useRef, useState } from 'react'

const Hero = () => {
    const containerRef = useRef(null)
    const canvasRef = useRef(null)
    const [images, setImages] = useState([])
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    
    const totalFrames = 147
    const targetFrameRef = useRef(1)
    const currentFrameRef = useRef(1)

    // Preload images
    useEffect(() => {
        const loadedImages = []
        let loadedCount = 0

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image()
            const frameNum = String(i).padStart(3, '0')
            img.src = `/frames/ezgif-frame-${frameNum}.jpg`
            img.onload = () => {
                loadedCount++
                if (loadedCount === totalFrames) {
                    setImagesLoaded(true)
                }
            }
            loadedImages.push(img)
        }
        setImages(loadedImages)
    }, [])

    // Handle scroll progress
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return
            
            const rect = containerRef.current.getBoundingClientRect()
            const scrollTrackHeight = rect.height - window.innerHeight
            
            // Calculate progress (0 to 1)
            let progress = -rect.top / scrollTrackHeight
            progress = Math.max(0, Math.min(1, progress))
            
            setScrollProgress(progress)
            
            // Map progress to target frame index (1-147)
            const targetFrame = Math.max(1, Math.min(totalFrames, Math.round(progress * (totalFrames - 1)) + 1))
            targetFrameRef.current = targetFrame
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Trigger initially
        
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Smooth animation rendering loop
    useEffect(() => {
        if (!imagesLoaded || images.length === 0) return

        let animationFrameId
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')

        const drawFrame = (frameIndex) => {
            if (!ctx || !canvas || !images[frameIndex - 1]) return
            
            const img = images[frameIndex - 1]
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Calculate cover size (crops top/bottom slightly on wide screens to fill sides completely)
            const canvasRatio = canvas.width / canvas.height
            const imgRatio = img.width / img.height
            
            let drawWidth = canvas.width
            let drawHeight = canvas.height
            let offsetX = 0
            let offsetY = 0
            
            if (canvasRatio < imgRatio) {
                // Canvas is taller/narrower than image
                drawWidth = canvas.height * imgRatio
                offsetX = (canvas.width - drawWidth) / 2
            } else {
                // Canvas is wider than image (desktop)
                drawHeight = canvas.width / imgRatio
                offsetY = (canvas.height - drawHeight) / 2
            }
            
            // Enable high-quality image smoothing for sharp upscaling
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            // Draw image on canvas
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
        }

        const resizeCanvas = () => {
            if (!canvas) return
            canvas.width = window.innerWidth * window.devicePixelRatio
            canvas.height = window.innerHeight * window.devicePixelRatio
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            drawFrame(Math.round(currentFrameRef.current))
        }

        window.addEventListener('resize', resizeCanvas)
        resizeCanvas() // Initial setup

        const render = () => {
            // Easing / Lerp equation: current = current + (target - current) * easeRate
            const easeRate = 0.08
            const delta = targetFrameRef.current - currentFrameRef.current
            
            if (Math.abs(delta) > 0.01) {
                currentFrameRef.current += delta * easeRate
                drawFrame(Math.round(currentFrameRef.current))
            } else {
                currentFrameRef.current = targetFrameRef.current
            }
            
            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [imagesLoaded, images])

    // Helper to control text fade timing based on scroll progress
    const getOpacity = (start, end) => {
        if (scrollProgress >= start && scrollProgress <= end) {
            // Fade in in the first 5% of the range, fade out in the last 5%
            const fadeInThreshold = start + 0.05
            const fadeOutThreshold = end - 0.05
            
            if (scrollProgress < fadeInThreshold) {
                // If it's the very first slide (start === 0), it should be fully visible by default
                return start === 0 ? 1 : (scrollProgress - start) / 0.05
            } else if (scrollProgress > fadeOutThreshold) {
                return (end - scrollProgress) / 0.05
            }
            return 1
        }
        return 0
    }

    return (
        <div ref={containerRef} className="relative h-[300vh] bg-[#a5a6a0] select-none -mt-20">
            {/* Sticky viewport container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#a5a6a0]">
                {/* Canvas representing the frame animation */}
                <canvas ref={canvasRef} className="block bg-[#a5a6a0]" />

                {/* Skeleton Loader / Preloading indicator */}
                {!imagesLoaded && (
                    <div className="absolute inset-0 flex flex-col items-start justify-center bg-[#EAE5DB] px-8 sm:px-16 md:px-24 z-50">
                        <div className="max-w-md w-full animate-pulse flex flex-col gap-4">
                            {/* Eyebrow skeleton */}
                            <div className="h-3 w-32 bg-[#D4C3A3] rounded-full mb-2"></div>
                            {/* Title skeleton */}
                            <div className="h-12 sm:h-16 w-3/4 bg-[#D4C3A3] rounded-md mb-2"></div>
                            <div className="h-12 sm:h-16 w-5/6 bg-[#D4C3A3] rounded-md"></div>
                            {/* Subtitle skeleton */}
                            <div className="h-4 w-full bg-[#D4C3A3] rounded-full mt-4"></div>
                            <div className="h-4 w-4/5 bg-[#D4C3A3] rounded-full"></div>
                        </div>
                        {/* Scroll indicator skeleton */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
                            <div className="h-2 w-10 bg-[#D4C3A3] rounded-full"></div>
                            <div className="w-5 h-8 border-2 border-[#D4C3A3] rounded-full"></div>
                        </div>
                    </div>
                )}

                {/* Premium Luxury Gradient Overlay for Text Readability - Dark Brown & Charcoal */}
                {imagesLoaded && (
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1E1914]/60 via-transparent to-transparent z-10" />
                )}

                {/* Fading text overlays */}
                {imagesLoaded && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-start max-w-7xl mx-auto px-8 sm:px-16 md:px-24 text-left z-20">
                        {/* Slide 1: Welcome */}
                        <div 
                            style={{ opacity: getOpacity(0, 0.22), transition: 'opacity 0.2s ease-out' }}
                            className="absolute flex flex-col items-start max-w-md text-[#FDFBF7]"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] font-bold mb-3 text-[#D4B26F]">APEX TEXTILE MILLS</span>
                            <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight">
                                Pure Italian Silk Collection
                            </h2>
                            <p className="text-sm mt-4 max-w-sm text-[#FDFBF7]/90 font-medium tracking-wide leading-relaxed">
                                Scroll down to explore raw materials spinning into premium craftsmanship.
                            </p>
                        </div>

                        {/* Slide 2: Fabric Material */}
                        <div 
                            style={{ opacity: getOpacity(0.28, 0.52), transition: 'opacity 0.2s ease-out' }}
                            className="absolute flex flex-col items-start max-w-md text-[#FDFBF7]"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] font-bold mb-3 text-[#D4B26F]">CRAFTED FROM NATURE</span>
                            <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight">
                                Woven from 100% Raw Fiber
                            </h2>
                            <p className="text-sm mt-4 max-w-sm text-[#FDFBF7]/90 font-medium tracking-wide leading-relaxed">
                                Ethically sourced and spun with precision weight for luxury tailoring.
                            </p>
                        </div>

                        {/* Slide 3: Quality Details */}
                        <div 
                            style={{ opacity: getOpacity(0.58, 0.82), transition: 'opacity 0.2s ease-out' }}
                            className="absolute flex flex-col items-start max-w-md text-[#FDFBF7]"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] font-bold mb-3 text-[#D4B26F]">UNRIVALED STANDARD</span>
                            <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight">
                                Density & Strength Perfected
                            </h2>
                            <p className="text-sm mt-4 max-w-sm text-[#FDFBF7]/90 font-medium tracking-wide leading-relaxed">
                                High-thread fabrics engineered for garment makers, wholesalers, and designers.
                            </p>
                        </div>

                        {/* Slide 4: CTA Call */}
                        <div 
                            style={{ opacity: getOpacity(0.88, 1), transition: 'opacity 0.2s ease-out' }}
                            className="absolute flex flex-col items-start max-w-md text-[#FDFBF7]"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] font-bold mb-3 text-[#D4B26F]">READY TO ORDER</span>
                            <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight">
                                Explore Our Catalog Below
                            </h2>
                            <p className="text-sm mt-4 max-w-sm text-[#FDFBF7]/90 font-medium tracking-wide leading-relaxed">
                                Wholesale pricing and direct mills sourcing starts right here.
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Visual scroll indicator */}
                {imagesLoaded && scrollProgress < 0.95 && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#FDFBF7] opacity-80 z-20">
                        <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
                        <div className="w-5 h-8 border border-[#FDFBF7] rounded-full flex justify-center p-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                            <div className="w-1 h-2 bg-[#FDFBF7] rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Hero