import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pb-32">
            
            {/* Header */}
            <div className="w-full relative bg-[#1E1914] pt-24 pb-20 flex flex-col items-center justify-center text-center overflow-hidden border-b-[4px] border-[#D4B26F]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E1914]/40 via-[#1E1914]/70 to-[#1E1914]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,178,111,0.05)_0%,transparent_70%)]" />
                
                <div className="relative z-10 max-w-4xl px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-[#FDFBF7] mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-[#D3C9BD] text-sm tracking-widest uppercase">
                        Last Updated: August 4, 2026
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16">
                
                <Link href="/" className="inline-flex items-center gap-2 text-[#D4B26F] font-semibold text-sm hover:text-[#1E1914] transition-colors mb-12 uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#1E1914] prose-p:text-[#4A3F35] prose-a:text-[#D4B26F]">
                    
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Anantin. We are committed to protecting your personal data and respecting your privacy. 
                        This privacy policy will inform you as to how we look after your personal data when you visit our website 
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2>2. The Data We Collect About You</h2>
                    <p>
                        Personal data, or personal information, means any information about an individual from which that person can be identified. 
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-[#4A3F35]">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Financial Data</strong> includes bank account and payment card details.</li>
                        <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                    </ul>

                    <h2>3. How We Use Your Personal Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-[#4A3F35]">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, 
                        altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. 
                        They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                    </p>

                    <h2>5. Your Legal Rights</h2>
                    <p>
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data. 
                        These include the right to request access, correction, erasure, restriction, transfer, to object to processing, 
                        to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                    </p>

                    <div className="bg-[#FAF8F5] border border-[#EAE0D5] p-8 rounded-2xl mt-12">
                        <h3 className="text-xl font-serif font-semibold text-[#1E1914] mb-4 mt-0">Contact Us About Privacy</h3>
                        <p className="mb-0">
                            If you have any questions about this privacy policy or our privacy practices, please contact us at: <br/>
                            <a href="mailto:privacy@anantin.com" className="font-semibold text-[#D4B26F] hover:underline">privacy@anantin.com</a>
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
