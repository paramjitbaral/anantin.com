import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pt-12 pb-16 px-6 sm:px-12 selection:bg-[#D4B26F] selection:text-[#1E1914]">
            <div className="max-w-5xl mx-auto bg-white p-10 md:p-16 border border-[#EAE0D5] shadow-[0_4px_20px_rgba(44,36,27,0.02)]">
                
                <div className="mb-16 border-b border-[#EAE0D5] pb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#1E1914] mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-[#5A4F44] text-sm uppercase tracking-widest font-semibold">Effective Date: August 4, 2026</p>
                </div>

                <div className="space-y-12 text-[#2C241B] font-normal leading-relaxed text-sm md:text-base">
                    
                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">1. Purpose and Scope</h2>
                        <p className="mb-4">
                            This Privacy Policy ("Policy") governs the manner in which Anantin Inc. ("Anantin", "we", "our", or "us") collects, uses, maintains, and discloses information collected from users (each, a "User") of the anantin.com website and its associated B2B textile network services (collectively, the "Platform"). This Policy applies to the Platform and all products and services offered by Anantin.
                        </p>
                        <p className="mb-4">
                            By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by the terms of this Policy. If you do not agree to this Policy, please do not use our Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">2. Information Collection</h2>
                        <p className="mb-4">
                            We may collect personally identifiable information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Platform. 
                        </p>
                        <ul className="list-disc pl-6 space-y-3 text-[#2C241B]">
                            <li><strong>Corporate Identity Data:</strong> Company name, registration numbers, tax identification numbers, and primary business domain.</li>
                            <li><strong>Personal Identity Data:</strong> First name, last name, authorized representative titles, and signatures.</li>
                            <li><strong>Contact Data:</strong> Billing address, shipping address, corporate email address, and telephone numbers.</li>
                            <li><strong>Financial Data:</strong> Bank account details, payment card details, and credit history as necessary for B2B transactions.</li>
                            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types, operating system, and platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">3. Use of Collected Information</h2>
                        <p className="mb-4">
                            Anantin collects and uses User's personal and corporate information for the following commercial purposes:
                        </p>
                        <ul className="list-decimal pl-6 space-y-3 text-[#2C241B]">
                            <li><em>To facilitate B2B transactions:</em> Information is required to verify the identity of textile mills, fashion houses, and buyers, and to process bulk orders securely.</li>
                            <li><em>To improve customer service:</em> Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
                            <li><em>To personalize user experience:</em> We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Platform.</li>
                            <li><em>To send periodic emails:</em> We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">4. Data Protection and Security</h2>
                        <p className="mb-4">
                            We adopt robust, industry-standard data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Platform. Sensitive and private data exchange between the Platform and its Users happens over an SSL secured communication channel and is encrypted and protected with digital signatures.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">5. Sharing Personal Information</h2>
                        <p className="mb-4">
                            We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above. We may use third-party service providers to help us operate our business and the Platform or administer activities on our behalf, such as sending out newsletters or surveys.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">6. Legal Compliance and Disclosure</h2>
                        <p className="mb-4">
                            We reserve the right to disclose your personal data as required by law and when we believe that disclosure is necessary to protect our rights, to comply with a judicial proceeding, court order, or legal process served on our Platform, or in connection with an actual or proposed corporate transaction or insolvency proceeding involving all or part of the business or asset to which the information pertains.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#1E1914] mb-4 uppercase tracking-wide">7. Contacting Us</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact our Legal Department:
                        </p>
                        <div className="bg-[#FAF8F5] p-6 border border-[#EAE0D5] rounded-sm mt-6">
                            <p className="font-bold text-[#1E1914] mb-1">Anantin Legal Department</p>
                            <p className="text-[#2C241B]">Surat Textile Hub, Ring Road, Textile Market</p>
                            <p className="text-[#2C241B]">Surat, Gujarat 395002, India</p>
                            <p className="text-[#2C241B] mt-4">Email: <a href="mailto:legal@anantin.com" className="text-[#8b795a] hover:underline font-medium">legal@anantin.com</a></p>
                            <p className="text-[#2C241B]">Phone: +91 98765 43210</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
