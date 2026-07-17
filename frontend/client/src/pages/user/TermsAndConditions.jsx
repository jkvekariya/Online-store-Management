import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/policies.css';

const TermsAndConditions = () => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/page-content/terms');
                setContent(res.data);
            } catch (error) {
                console.error("Error fetching terms");
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="policy-container">
            <header className="policy-header">
                <h1>{content?.title || "Terms & Conditions"}</h1>
            </header>
            <div className="policy-content">
                <p><strong>Effective Date</strong>: {content?.sections?.effectiveDate || "February 6, 2026"}</p>
                <p>{content?.sections?.introduction || "Welcome to the Online Store Management System. These Terms & Conditions constitute a legally binding agreement..."}</p>

                <h3>1. Formal Introduction and Scope</h3>
                <p>These comprehensive Terms & Conditions govern every aspect of your professional and personal use of our e-commerce platform. This includes browsing the catalog, creating a user profile, interacting with our customer service team, and the final purchase of fashion products from our extensive online inventory. These terms apply to all visitors, users, and others who access or use the Service. By using this site, you accept these terms in full and acknowledge that they take precedence over any other verbal or secondary agreements you may have with us. We reserve the right to deny service to anyone for any reason at any time, especially in cases of suspected system abuse or violation of these established protocols.</p>

                <h3>2. User Account Registration and Responsibilities</h3>
                <p>To access the full suite of features offered by our site—such as order tracking, wishlist management, and personalized recommendations—you will be required to create a formal user account. During the registration process, you must provide accurate, current, and complete information as prompted by our registration forms. Maintaining the absolute confidentiality of your account login credentials, including your unique password, is your sole responsibility. You agree to notify us immediately of any unauthorized use of your account or any other breach of security that you become aware of. We are not liable for any losses or damages caused by unauthorized access to your account resulting from your failure to safeguard your login details. Furthermore, we reserve the right to suspend or terminate accounts that are found to contain misleading information or are involved in activities that infringe upon the rights of others.</p>

                <h3>3. Product Descriptions, Pricing, and Availability</h3>
                <p>We make every possible effort to ensure that the product descriptions, fashion imagery, and pricing shown on our website are as accurate and up-to-date as possible. However, the Online Store Management System does not warrant that product specifications, colors, or other content are entirely error-free, complete, or reliable at all times. Due to variations in digital displays and monitor settings, the actual colors of clothing may differ slightly from what you see on your screen. In the event that a product is listed at an incorrect price due to a system glitch or typographical error, we reserve the full right to refuse or cancel any orders placed for that product, even after an order confirmation has been sent or your payment has been processed. If your payment has already been made, we will issue a full refund to your original payment method immediately upon cancellation.</p>

                <h3>4. Payment Terms, Shipping, and Delivery Logistics</h3>
                <p>All financial transactions on our platform are processed through highly secure, industry-standard third-party payment gateways to ensure your financial safety. By placing an order, you represent that you have the legal right to use the payment method provided. Shipping and delivery times shared on our site are provided as estimates only and are not guaranteed delivery dates. While we strive to ship all orders within 24-48 hours, delays can occur due to high demand, weather conditions, or issues with third-party logistics providers. We are not legally liable for any losses, costs, or damages arising from delayed deliveries caused by shipping carriers, customs clearance procedures, or other factors beyond our direct control. Risk of loss and title for items purchased from our site pass to you upon our delivery to the carrier.</p>

                <h3>5. Intellectual Property Rights and Content Ownership</h3>
                <p>All content featured on this website—including but not limited to brand logos, custom graphics, website text, product names, page headers, buttons, and proprietary design layouts—is the exclusive legal property of Online Store Management System or its content suppliers. This material is protected by international copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the site for personal, non-commercial shopping purposes only. You are strictly prohibited from reproducing, duplicating, copying, selling, reselling, or exploiting any portion of the website's content without our express, prior written permission. Any unauthorized use of our intellectual property may result in legal action and the immediate termination of your access to our services.</p>

                <h3>6. Prohibited Activities and System Security</h3>
                <p>As a condition of your use of our website, you agree not to use the platform for any purpose that is unlawful or prohibited by these terms. Specifically, you agree that you will not:</p>
                <ul>
                    <li>Engage in any activity that could disable, overburden, or damage the website's technical infrastructure or interfere with any other party's use and enjoyment of the site.</li>
                    <li>Use any automated device, spider, or manual process to "scrape" or monitor our website content or data without our prior written consent.</li>
                    <li>Upload or transmit any form of malware, viruses, or code of a destructive nature aimed at stealing user data or crashing the platform.</li>
                    <li>Attempt to gain unauthorized access to any part of the website, user accounts, or computer systems connected to our network through hacking or password mining.</li>
                    <li>Post or distribute content that is defamatory, obscene, threatening, or otherwise harmful to our employees, customers, or the general public.</li>
                </ul>
                <p>Any violation of these security protocols will result in immediate termination of your account and may be reported to law enforcement authorities for criminal investigation.</p>

                <h3>7. Limitation of Liability and Indemnification</h3>
                <p>To the maximum extent permitted by applicable law, Online Store Management System shall not be liable for any indirect, incidental, punitive, or consequential damages of any kind, including but not limited to loss of profits, data, or reputation, arising from your use of or inability to use our website or products. Our total liability for any claim arising out of these terms or our relationship with you shall not exceed the total amount paid by you for the specific product or service that gave rise to the claim. You agree to indemnify, defend, and hold harmless our company and its directors, employees, and partners from any claims, liabilities, or expenses (including legal fees) arising from your breach of these Terms & Conditions or your violation of any laws or rights of a third party.</p>

                <h3>8. Governing Law and Dispute Resolution</h3>
                <p>These Terms & Conditions and your use of the website are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal action or proceeding related to your access to or use of the site shall be instituted exclusively in the courts located in New Delhi, India. You hereby consent to the personal jurisdiction of such courts and waive any objection to the laying of venue in such courts. In the event of a dispute, we encourage you to contact our legal department first to seek an informal resolution. If an informal resolution cannot be reached within 60 days, both parties agree to resolve the matter through binding arbitration or the court system as per the laws of the land.</p>

                <h3>9. Site Governance and Amendments</h3>
                <p>We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms & Conditions by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the service following the posting of any changes to these Terms & Conditions constitutes acceptance of those changes. Furthermore, we reserve the right to modify or discontinue the website (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the service.</p>

                <h3>10. Formal Communication and Contact Information</h3>
                <p>Any notices or other communications permitted or required under these terms will be provided in writing and sent via email or through prominent notifications on our website. For any inquiries, legal questions, or clarifications regarding these binding Terms & Conditions, please contact our administrative team at <strong>legal@onlinestore.com</strong>. We take all feedback seriously and aim to address legal inquiries with the utmost professionalism. For general customer support issues related to your orders, please continue to use our primary support email at support@onlinestore.com. Our physical office remains open for official correspondence at 123 Fashion Street, Cyber Hub, New Delhi, India.</p>
            </div>
        </div>
    );
};

export default TermsAndConditions;
