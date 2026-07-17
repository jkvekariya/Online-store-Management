import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/policies.css';

const PrivacyPolicy = () => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/page-content/privacy');
                setContent(res.data);
            } catch (error) {
                console.error("Error fetching privacy policy");
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="policy-container">
            <header className="policy-header">
                <h1>{content?.title || "Privacy Policy"}</h1>
            </header>
            <div className="policy-content">
                <p><strong>Effective Date</strong>: {content?.sections?.effectiveDate || "February 6, 2026"}</p>
                <p>{content?.sections?.introduction || "At Online Store Management System, we are deeply committed to protecting the privacy and security of our customers and site visitors..."}</p>

                <h3>Data Controller, DPO, and Contact</h3>
                <ul>
                    <li><strong>Data Controller</strong>: Online Store Management System is the primary entity responsible for your data. We determine why and how your personal information is processed, ensuring that every step of the data lifecycle complies with global privacy standards and local regulations.</li>
                    <li><strong>Data Protection Officer (DPO)</strong>: To further our commitment to privacy, we have appointed a dedicated Data Protection Officer who oversees our data strategy and implementation to ensure compliance with GDPR and other data protection requirements.</li>
                    <li><strong>Address</strong>: 123 Fashion Street, Cyber Hub, New Delhi, India - 110001. This is our physical headquarters where all high-level data management decisions are centralized and monitored by our security teams.</li>
                    <li><strong>Email</strong>: privacy@onlinestore.com. You can reach out to our privacy team at any time for questions regarding your data, to exercise your rights, or to report any concerns you might have about your personal information.</li>
                    <li><strong>Phone Number</strong>: +91 98765 43210. Our support line is available during business hours to provide immediate assistance with any privacy-related inquiries or technical issues you may encounter.</li>
                </ul>

                <h3>Types of Data We Collect</h3>
                <p>We collect various types of personal information that you provide to us directly or that we gather automatically through your use of our services. This collection is essential for providing a seamless shopping experience. The categories of data we collect include:</p>
                <ol>
                    <li><strong>Personal Identification Information</strong>: This includes your full legal name, primary and secondary email addresses, detailed physical delivery addresses, and telephone numbers. This information is primarily used to identify you as a unique user and to facilitate the delivery of goods and services. For example, when you place an order, we require your mobile number to send tracking updates and for delivery personnel to contact you if necessary.</li>
                    <li><strong>Account Details</strong>: To enhance your experience, we store your unique username, encrypted password, and a comprehensive history of all your purchases and interactions with our site. This allow us to provide you with a personalized dashboard where you can manage your preferences, track current shipments, and view previous invoices for tax or warranty purposes without having to re-enter your details every time.</li>
                    <li><strong>Payment Information</strong>: We collect billing addresses and payment-related information; however, all sensitive credit/debit card details are processed directly through our secure, PCI-compliant payment providers. We do not store full card numbers on our own servers to minimize security risks. The billing address is used specifically for fraud prevention and bank verification during the transaction process.</li>
                    <li><strong>Technical Data</strong>: Every time you access our site, we automatically collect technical details such as your IP address, browser type and version, specific time zone settings, device geolocation (with your permission), browser plug-in types, and the operating system you are using. This technical telemetry helps us optimize our website's performance for your specific device and helps us detect and block suspicious or malicious traffic.</li>
                    <li><strong>Usage Data</strong>: We track how you navigate through our website, which products you view for how long, what items you add or remove from your wishlist/cart, and your overall interaction patterns. We use this behavioral data to understand market trends, improve our navigation menus, and personalize the products we feature on your home screen to better match your fashion interests.</li>
                </ol>

                <h3>Why We Collect This Data</h3>
                <p>Our primary goal in collecting your information is to provide you with a safe, efficient, and customized shopping journey. We use your data for several key business purposes:</p>
                <ul>
                    <li><strong>Order Fulfillment</strong>: We use your data to process transactions, manage payments, and handle the logistics of shipping your orders. Without your contact and address information, we would be unable to deliver the high-quality products you order from our platform.</li>
                    <li><strong>Customer Support</strong>: Your account history and contact details allow our support team to quickly identify you and provide personalized assistance if you encounter issues with an order, a product, or your account settings. This helps us resolve your problems faster and more accurately.</li>
                    <li><strong>Personalized Marketing</strong>: With your consent, we use your browsing history to send you notifications about new arrivals, flash sales, and exclusive discounts that align with your style preferences. We aim to only send you content that you will find genuinely useful and relevant.</li>
                    <li><strong>Security and Fraud Prevention</strong>: We analyze technical and usage data to monitor our systems for unauthorized access and fraudulent transactions. This protect both our business and your personal accounts and financial information from cyber threats.</li>
                    <li><strong>Research and Development</strong>: Aggregated, non-identifiable data helps us understand broader consumer trends. This allows us to improve our website design, source better products, and develop new features that make online shopping more enjoyable for everyone.</li>
                </ul>

                <h3>Legal Basis for Processing</h3>
                <p>We only process your personal data when we have a valid legal justification to do so. These "legal bases" include:</p>
                <ol>
                    <li><strong>Explicit Consent</strong>: For activities like sending marketing newsletters or using non-essential cookies, we ask for your clear consent beforehand. You have the absolute right to withdraw this consent at any time through your account settings or via the unsubscribe links provided in our emails.</li>
                    <li><strong>Contractual Necessity</strong>: When you buy something from us, we must process your data to fulfill our part of the sales contract. This includes processing payments and sharing your delivery details with our logistics partners to get the product to your doorstep.</li>
                    <li><strong>Legitimate Interests</strong>: We process some data for our own legitimate business interests, such as improving our website's security, conducting internal research, or preventing fraud. We always balance these interests against your own privacy rights to ensure there is no unfair impact on you.</li>
                    <li><strong>Legal and Regulatory Obligations</strong>: In certain situations, we may be legally required to store or share your data, such as for tax accounting purposes, responding to court orders, or complying with requests from government authorities for national security or law enforcement.</li>
                </ol>

                <h3>Data Storage, Erasure, and Security</h3>
                <p>We take the security of your data very seriously and have implemented robust barriers to protect it. Our data retention and security practices include:</p>
                <p><strong>Retention Policy</strong>: We only store your personal information for as long as it is needed to fulfill the purposes for which it was collected, or as required by law. For instance, we keep order records for several years to comply with financial auditing and tax regulations. Once the data is no longer necessary, it is either permanently deleted from our servers or fully anonymized so that it can no longer be linked to you.</p>
                <p><strong>Advanced Security Measures</strong>: We use industry-standard Secure Sockets Layer (SSL) encryption for all data transmitted between your browser and our servers. Our databases are protected by multi-layer firewalls, and we conduct regular security audits to identify and fix potential vulnerabilities. Access to personal data is strictly limited to authorized employees who need it to perform their specific job functions.</p>

                <h3>Data Transfer Outside the EU/EEA</h3>
                <p>Because we operate globally, we may sometimes need to transfer your data to servers or service providers located outside of your home country, including countries outside the European Economic Area (EEA). Some of these countries may have different data protection laws than your own. To ensure your data remains protected, we only use providers that offer high security standards and we implement "Standard Contractual Clauses" (SCCs) approved by the European Commission. These clauses legally bind the recipient of the data to protect it according to strict European privacy standards, ensuring your rights are upheld regardless of where your data is processed.</p>

                <h3>Use of Cookies and Other Trackers</h3>
                <p>Our website uses "cookies"—small text files stored on your device—to enhance your user experience. These include "Essential Cookies" which are necessary for the site to function (like keeping you logged in), "Analytical Cookies" which help us see how the site is being used, and "Marketing Cookies" which allow us to show you relevant advertisements on other platforms. You have full control over these trackers; you can block them through your browser's privacy settings or through our cookie management banner. Note that disabling certain cookies may limit your ability to use some features of our website, such as saving items in your shopping cart for later.</p>

                <h3>Your Rights</h3>
                <p>Under modern data protection laws like the GDPR, you have significant control over your personal information. Your rights include:</p>
                <ul>
                    <li><strong>Right of Access</strong>: You can request a full digital copy of all the personal information we hold about you at any time. We will provide this in a clear, structured, and commonly used format.</li>
                    <li><strong>Right to Rectification</strong>: If any of your details or preferences are incorrect or outdated, you have the right to ask us to update or correct them immediately to ensure your account remains accurate.</li>
                    <li><strong>Right to Erasure (The "Right to be Forgotten")</strong>: You can request that we delete your account and all associated personal data from our systems, provided we don't have a overriding legal reason to keep it (such as unpaid balances or ongoing legal disputes).</li>
                    <li><strong>Right to Restrict or Object to Processing</strong>: You can ask us to stop using your data for specific purposes, such as direct marketing, or request that we "pause" processing if you are contesting the accuracy of the data we hold.</li>
                    <li><strong>Right to Data Portability</strong>: You have the right to take your data with you. We can provide you with your data in a machine-readable format so you can easily transfer it to another service provider if you choose to leave our platform.</li>
                </ul>

                <h3>Contact Information</h3>
                <p>If you have any questions about this Privacy Policy, our data handling practices, or if you would like to exercise any of your legal rights, please do not hesitate to contact our dedicated privacy team at <strong>privacy@onlinestore.com</strong>. We aim to respond to all inquiries within 30 days. For urgent matters, you may also call our support line at +91 98765 43210.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
