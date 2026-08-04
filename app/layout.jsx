import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import StoreInitializer from "@/components/StoreInitializer";
import { getAllProducts } from "@/actions/product";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Anantin. - Shop smarter",
    description: "Anantin. - Shop smarter",
};

export default async function RootLayout({ children }) {
    const products = await getAllProducts();

    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <StoreInitializer products={products} />
                    <Toaster toastOptions={{ style: { whiteSpace: 'nowrap' } }} />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
