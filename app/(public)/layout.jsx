'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAssistant from "@/components/FloatingAssistant";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <>
            {!isAuthPage && <Banner />}
            {!isAuthPage && <Navbar />}
            <main>{children}</main>
            {!isAuthPage && <Footer />}
            <FloatingAssistant />
        </>
    );
}
