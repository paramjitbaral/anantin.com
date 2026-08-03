import gs_logo from "./gs_logo.jpg"
import happy_store from "./happy_store.webp"
import upload_area from "./upload_area.svg"
import hero_model_img from "./hero_model_img.png"
import hero_product_img1 from "./hero_product_img1.png"
import hero_product_img2 from "./hero_product_img2.png"
import product_img1 from "./product_img1.png"
import product_img2 from "./product_img2.png"
import product_img3 from "./product_img3.png"
import product_img4 from "./product_img4.png"
import product_img5 from "./product_img5.png"
import product_img6 from "./product_img6.png"
import product_img7 from "./product_img7.png"
import product_img8 from "./product_img8.png"
import product_img9 from "./product_img9.png"
import product_img10 from "./product_img10.png"
import product_img11 from "./product_img11.png"
import product_img12 from "./product_img12.png"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg"
import profile_pic2 from "./profile_pic2.jpg"
import profile_pic3 from "./profile_pic3.jpg"

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1, hero_product_img2, gs_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,
}

export const categories = ["Cotton Fabric", "Linen Fabric", "Silk Fabric", "Denim Fabric", "Polyester Fabric", "Rayon Fabric", "Wool Fabric", "Satin Fabric", "Chiffon Fabric", "Canvas Fabric", "Terry Cloth", "Velvet Fabric"];

export const dummyRatingsData = [
    { id: "rat_1", rating: 4.2, review: "Incredibly high-quality weave. Perfect weight for summer shirting. Highly recommend.", user: { name: 'Kristin Watson', image: profile_pic1 }, productId: "prod_1", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Egyptian Cotton Fabric', category:'Cotton Fabric', id:'prod_1'} },
    { id: "rat_2", rating: 5.0, review: "Superb drape and premium feel. Ideal for bespoke garments. Fast shipping.", user: { name: 'Jenny Wilson', image: profile_pic2 }, productId: "prod_2", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Pure Linen Fabric', category:'Linen Fabric', id:'prod_2'} },
    { id: "rat_3", rating: 4.5, review: "Lustrous finish and extremely smooth. A dream to work with for bridal wear.", user: { name: 'Bessie Cooper', image: profile_pic3 }, productId: "prod_3", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Mulberry Silk Fabric', category:'Silk Fabric', id:'prod_3'} },
]

export const dummyStoreData = {
    id: "store_1",
    userId: "user_1",
    name: "Apex Textile Mills",
    description: "Apex Textile Mills is a leading global supplier of premium raw fabrics and finished textiles, serving high-end fashion designers, boutique wholesalers, and apparel manufacturers.",
    username: "apextextiles",
    address: "Bldg 4, Industrial Zone, New York, US",
    status: "approved",
    isActive: true,
    logo: happy_store,
    email: "orders@apextextiles.com",
    contact: "+1 800-555-TEXT",
    createdAt: "2025-09-04T09:04:16.189Z",
    updatedAt: "2025-09-04T09:04:44.273Z",
    user: {
        id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "Apex Textiles",
        email: "contact@apextextiles.com",
        image: gs_logo,
    }
}

export const productDummyData = [
    {
        id: "prod_1",
        name: "Egyptian Long-Staple Cotton Fabric",
        description: "Finest quality long-staple Egyptian cotton fabric, renowned for its breathability, durability, and silky-soft finish. Ideal for premium bedding, shirts, and luxury resort wear. Sourced sustainably from ethical mills.",
        mrp: 650.00,
        price: 450.00,
        images: [product_img1, product_img2, product_img3, product_img4],
        category: "Cotton Fabric",
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        rating: dummyRatingsData,
        gsm: "120",
        width: "58 inches",
        material: "100% Egyptian Cotton",
        availableStock: 4500,
        colors: ["Pure White", "Warm Ivory", "Mist Blue", "Sand Beige"],
        createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_2",
        name: "Belgian Flax Linen Fabric",
        description: "100% natural Belgian flax linen. Pre-washed for exceptional softness and featuring a beautiful textured slub weave. Perfect for summer suits, lightweight jackets, drapery, and home furnishings.",
        mrp: 1200.00,
        price: 850.00,
        images: [product_img2],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Linen Fabric",
        rating: dummyRatingsData,
        gsm: "185",
        width: "60 inches",
        material: "100% Belgian Flax Linen",
        availableStock: 2800,
        colors: ["Natural Oatmeal", "Slate Grey", "Olive Green", "Deep Navy"],
        createdAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_3",
        name: "Mulberry Silk Charmeuse",
        description: "Premium Mulberry Silk with a high momme weight. Luxurious satin sheen on the face and a matte finish on the back. Drapes beautifully for evening wear, luxury linings, and bridal garments.",
        mrp: 2600.00,
        price: 1850.00,
        images: [product_img3],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Silk Fabric",
        rating: dummyRatingsData,
        gsm: "85",
        width: "54 inches",
        material: "100% Mulberry Silk",
        availableStock: 1200,
        colors: ["Champagne Gold", "Classic Black", "Emerald Green", "Crimson Red"],
        createdAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_4",
        name: "Organic Indigo Denim Fabric",
        description: "Sturdy organic cotton denim with a classic right-hand twill weave. Dyed with natural indigo. Excellent structural integrity, perfect for premium jeans, jackets, and workwear.",
        mrp: 550.00,
        price: 380.00,
        images: [product_img4],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Denim Fabric",
        rating: dummyRatingsData,
        gsm: "380",
        width: "58 inches",
        material: "98% Organic Cotton, 2% Elastane",
        availableStock: 3500,
        colors: ["Indigo Blue", "Deep Charcoal", "Bleached Indigo"],
        createdAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_5",
        name: "Merino Wool Flannel Fabric",
        description: "Finely brushed Merino wool flannel, offering exceptional warmth, softness, and natural water resistance. Perfect for high-end tailoring, heavy shirts, and cold-weather trousers.",
        mrp: 2000.00,
        price: 1450.00,
        images: [product_img5],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Wool Fabric",
        rating: dummyRatingsData,
        gsm: "310",
        width: "60 inches",
        material: "100% Merino Wool",
        availableStock: 950,
        colors: ["Heather Grey", "Camel Tan", "Forest Green", "Rich Burgundy"],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_6",
        name: "Fluid Rayon Crepe Fabric",
        description: "Lightweight rayon crepe fabric with a beautiful crinkled texture. Breathable, fluid drape, making it perfect for elegant dresses, blouses, and loose trousers.",
        mrp: 350.00,
        price: 240.00,
        images: [product_img6],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Rayon Fabric",
        rating: dummyRatingsData,
        gsm: "140",
        width: "56 inches",
        material: "100% Viscose Rayon",
        availableStock: 5000,
        colors: ["Terracotta", "Olive Oil", "Creamy White", "Mustard Yellow"],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_7",
        name: "Heavyweight Cotton Canvas",
        description: "Ultra-durable, double-weave cotton canvas fabric. Exceptional tensile strength, ideal for making premium tote bags, outerwear, uniforms, and home upholstery.",
        mrp: 450.00,
        price: 320.00,
        images: [product_img7],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Canvas Fabric",
        rating: dummyRatingsData,
        gsm: "420",
        width: "58 inches",
        material: "100% Cotton Canvas",
        availableStock: 6000,
        colors: ["Raw Ecru", "Olive Drab", "Saddle Brown", "Navy Blue"],
        createdAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_8",
        name: "Stretch Velvet Fabric",
        description: "Plush, high-pile stretch velvet with a brilliant sheen and rich drape. Extremely soft texture, perfect for luxurious evening wear, stage costumes, and elegant home accents.",
        mrp: 700.00,
        price: 480.00,
        images: [product_img8],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Velvet Fabric",
        rating: dummyRatingsData,
        gsm: "240",
        width: "58 inches",
        material: "90% Polyester, 10% Spandex",
        availableStock: 1800,
        colors: ["Royal Blue", "Midnight Black", "Deep Plum", "Hunter Green"],
        createdAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_9",
        name: "Italian Wool Crepe",
        description: "Premium wool crepe fabric imported from Italy. Excellent recovery, crisp textured hand, and high elasticity. Ideal for high-end suiting, structural dresses, and blazers.",
        mrp: 3000.00,
        price: 2200.00,
        images: [product_img9],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Wool Fabric",
        rating: dummyRatingsData,
        gsm: "220",
        width: "56 inches",
        material: "100% Pure Italian Wool",
        availableStock: 800,
        colors: ["Ivory White", "Camel", "French Navy", "Jet Black"],
        createdAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_10",
        name: "Luxury Polyester Satin",
        description: "Ultra-smooth polyester satin with a high-gloss finish. Lightweight, fluid movement, and highly wrinkle-resistant. Perfect for linings, bridal sleepwear, and decorations.",
        mrp: 250.00,
        price: 180.00,
        images: [product_img10],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Satin Fabric",
        rating: dummyRatingsData,
        gsm: "110",
        width: "60 inches",
        material: "100% Premium Polyester",
        availableStock: 7500,
        colors: ["Rose Gold", "Silver Mist", "Teal Blue", "Pearl Cream"],
        createdAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_11",
        name: "Sheer Silk Chiffon",
        description: "Delicate, lightweight, and semi-transparent silk chiffon. Beautiful airy drape with a soft crinkled texture. Ideal for layering, flowing dresses, scarves, and overlays.",
        mrp: 1100.00,
        price: 750.00,
        images: [product_img11],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Chiffon Fabric",
        rating: dummyRatingsData,
        gsm: "45",
        width: "54 inches",
        material: "100% Mulberry Silk Chiffon",
        availableStock: 1100,
        colors: ["Blush Pink", "Sage Green", "Soft Lavender", "Sky Blue"],
        createdAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_12",
        name: "Soft Cotton Terry Cloth",
        description: "Thick, loop-woven cotton terry cloth. Highly absorbent, breathable, and plush. Perfect for luxury bathrobes, beach towels, loungewear, and baby products.",
        mrp: 400.00,
        price: 290.00,
        images: [product_img12],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Terry Cloth",
        rating: dummyRatingsData,
        gsm: "350",
        width: "60 inches",
        material: "100% Cotton Terry",
        availableStock: 2400,
        colors: ["Classic White", "Seafoam Green", "Slate Grey", "Peach Cream"],
        createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
    }
];

export const ourSpecsData = [
    { title: "Free Shipping", description: "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.", icon: SendIcon, accent: '#05DF72' },
    { title: "7 Days easy Return", description: "Change your mind? No worries. Return any item within 7 days.", icon: ClockFadingIcon, accent: '#FF8904' },
    { title: "24/7 Customer Support", description: "We're here for you. Get expert help with our customer support.", icon: HeadsetIcon, accent: '#A684FF' }
]

export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "John Doe",
    email: "johndoe@example.com",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "1234567890",
    createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
}

export const couponDummyData = [
    { code: "NEW20", description: "20% Off for New Users", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "NEW10", description: "10% Off for New Users", discount: 10, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "OFF20", description: "20% Off for All Users", discount: 20, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "OFF10", description: "10% Off for All Users", discount: 10, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "PLUS10", description: "20% Off for Members", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "GreatStack",
    email: "greatstack@example.com",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: dummyRatingsData[2],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0], },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1], }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4], }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const storesDummyData = [
    {
        id: "cmemkb98v0001tat8r1hiyxhn",
        userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "GreatStack",
        description: "GreatStack is the education marketplace where you can buy goodies related to coding and tech",
        username: "greatstack",
        address: "123 Maplewood Drive Springfield, IL 62704 USA",
        status: "approved",
        isActive: true,
        logo: gs_logo,
        email: "greatstack@example.com",
        contact: "+0 1234567890",
        createdAt: "2025-08-22T08:22:16.189Z",
        updatedAt: "2025-08-22T08:22:44.273Z",
        user: dummyUserData,
    },
    {
        id: "cmemkqnzm000htat8u7n8cpte",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        name: "Happy Shop",
        description: "At Happy Shop, we believe shopping should be simple, smart, and satisfying. Whether you're hunting for the latest fashion trends, top-notch electronics, home essentials, or unique lifestyle products — we've got it all under one digital roof.",
        username: "happyshop",
        address: "3rd Floor, Happy Shop , New Building, 123 street , c sector , NY, US",
        status: "approved",
        isActive: true,
        logo: happy_store,
        email: "happyshop@example.com",
        contact: "+0 123456789",
        createdAt: "2025-08-22T08:34:15.155Z",
        updatedAt: "2025-08-22T08:34:47.162Z",
        user: dummyUserData,
    }
]

export const dummyAdminDashboardData = {
    "orders": 6,
    "stores": 2,
    "products": 12,
    "revenue": "959.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "ratings": dummyRatingsData,
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}