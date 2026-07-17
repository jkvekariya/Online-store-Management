import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PageContent from './models/PageContent.js';
import Blog from './models/Blog.js';
import Category from './models/Category.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/online-store';

const categoriesData = [
    {
        name: 'Topwear',
        image: '/photos/shirt.png'
    },
    {
        name: 'Bottomwear',
        image: '/photos/jeans.png'
    },
    {
        name: 'Accessories',
        image: '/photos/accessories.png'
    },
    {
        name: 'Shoes',
        image: '/photos/shoes.png'
    },
    {
        name: 'Bags',
        image: '/photos/bag.png'
    },
    {
        name: 'Jackets',
        image: '/photos/jacket.png'
    }
];

const blogsData = [
    {
        title: "Seasonal Shirt Collection: Colors for Every Occasion",
        category: "SHIRTS",
        author: "Rahul Mehta",
        date: "January 16, 2025",
        excerpt: "Explore our latest range of versatile shirts, from soft linens to classic plaid patterns, curated for the modern wardrobe...",
        content: `A recent study has found that sleep aromatherapy may notably enhance memory, suggesting a non-invasive method protect against dementia.\n\nA new study by neuroscientists from the University of California, Irvine indicates that exposure to scent during sleep can notably enhance memory. Researchers say the findings indicate a non-invasive method to bolster memory and potentially protect against dementia.\n\nReleasing a scent into the bedrooms of older adults for two hours nightly over a span of six months, was found to be associated with significant memory improvements. According to a media release, study participants experienced a 226% increase in cognitive capacity compared to a control group.\n\nMen and women aged 60 to 85 without memory impairment were divided into two groups and given a diffuser and seven cartridges, each containing a single and different natural oil. The enriched group received full-strength cartridges and the control group received the oils in tiny amounts. Participants put a different cartridge into the diffuser each evening before going to bed, and it activated for two hours as they slept.\n\nThe scents they used were rose, orange, eucalyptus, lemon, peppermint, rosemary, and lavender.`,
        image: "/photos/blog-6.jpg",
        tags: ["NEWS", "SHIRTS"]
    },
    {
        title: "Step Ahead: The Ultimate Footwear Guide for 2024",
        category: "SHOES",
        author: "Arjun Kapoor",
        date: "February 10, 2025",
        excerpt: "Find the perfect balance of comfort and style with our latest collection of premium sneakers and casual loafers...",
        content: "Detailed content about footwear trends...",
        image: "/photos/blog-1.jpg",
        tags: ["TRENDS", "SHOES"]
    },
    {
        title: "The Art of Layering: Sophisticated Blue Knitwear",
        category: "TOP WEAR",
        author: "Vikram Singh",
        date: "March 05, 2025",
        excerpt: "Master the classic look with our premium blue cable-knit sweaters. Discover how to layer for a refined, cozy aesthetic...",
        content: "Detailed content about knitwear...",
        image: "/photos/blog-5.jpg",
        tags: ["FASHION", "TOP WEAR"]
    },
    {
        title: "Timeless Elegance: Choosing Your Signature Handbag",
        category: "BAGS",
        author: "Sia Sharma",
        date: "April 12, 2025",
        excerpt: "A great handbag is more than an accessory; it's a statement. Explore our luxury collection of leather totes and satchels...",
        content: "Detailed content about handbags...",
        image: "/photos/blog-3.jpg",
        tags: ["LUXURY", "BAGS"]
    },
    {
        title: "Luxury Details: Accessories That Define Your Look",
        category: "ACCESSORIES",
        author: "Isha Malhotra",
        date: "May 20, 2025",
        excerpt: "From sleek designer wallets to statement sunglasses, discover the essential accessories that complete your daily ensemble...",
        content: "Detailed content about accessories...",
        image: "/photos/blog-2.jpg",
        tags: ["DETAILS", "ACCESSORIES"]
    },
    {
        title: "Street Style Essentials: Urban Fashion Reimagined",
        category: "STYLES",
        author: "Kabir Das",
        date: "June 15, 2025",
        excerpt: "Combine comfort with high-fashion trends. Learn how to mix urban essentials for a look that stands out in the city...",
        content: "Detailed content about street style...",
        image: "/photos/blog-4.jpg",
        tags: ["URBAN", "STYLES"]
    }
];

const pagesData = [
    {
        page: 'about',
        title: 'About Us',
        sections: {
            hero: {
                title: 'About Us & Our Skills',
                description: 'Welcome to our e-commerce store, where quality and customer satisfaction come first. We offer a wide range of carefully selected products to meet your everyday needs.',
                quote: 'Smart shopping starts here. Comfort, quality, and convenience in one place.',
                mission: 'Our mission is to provide reliable service, secure payments, and fast delivery, ensuring a seamless shopping experience from start to finish. We believe in building long-term relationships with our customers by offering value, transparency, and support at every step.'
            },
            explore: {
                title: 'Explore Our Products',
                description: 'Our store brings together diverse products across multiple categories, ensuring quality and consistency. We continuously update our collection to match trends and customer expectations.',
                quote: 'Every product we offer is carefully selected to combine quality, style, and value. Our collection is designed to meet modern needs while delivering lasting satisfaction.',
                p1: 'Our product collection is thoughtfully curated to meet the needs of modern customers. We focus on quality, usability, and style to ensure every product delivers real value and satisfaction.',
                p2: 'We believe products should be both functional and appealing. That’s why our collection reflects thoughtful design and lasting performance.'
            },
            stats: [
                { target: 240, title: 'Product Types' },
                { target: 3, title: 'Years Of Experience' },
                { target: 3500, title: 'Trust Customers' },
                { target: 15, title: 'Stores Nationwide' }
            ]
        }
    },
    {
        page: 'privacy',
        title: 'Privacy Policy',
        sections: {
            effectiveDate: 'February 6, 2026',
            introduction: 'At Online Store Management System, we are deeply committed to protecting the privacy and security of our customers and site visitors...',
            details: [
                {
                    heading: 'Data Controller, DPO, and Contact',
                    list: [
                        'Data Controller: Online Store Management System is the primary entity responsible for your data...',
                        'Data Protection Officer (DPO): To further our commitment to privacy, we have appointed a dedicated Data Protection Officer...',
                        'Address: 123 Fashion Street, Cyber Hub, New Delhi, India - 110001.',
                        'Email: privacy@onlinestore.com',
                        'Phone Number: +91 98765 43210'
                    ]
                }
            ]
        }
    },
    {
        page: 'terms',
        title: 'Terms & Conditions',
        sections: {
            effectiveDate: 'February 6, 2026',
            introduction: 'Welcome to the Online Store Management System. These Terms & Conditions constitute a legally binding agreement...',
            clauses: [
                {
                    heading: '1. Formal Introduction and Scope',
                    content: 'These comprehensive Terms & Conditions govern every aspect of your professional and personal use of our e-commerce platform...'
                }
            ]
        }
    },
    {
        page: 'contact',
        title: 'Contact Us',
        sections: {
            contactNumber: '+0123 234 9568',
            email: 'hello@gmail.com',
            address: '12, crystal plaza\nvarachha, surat - 395010\nGujarat.'
        }
    },
    {
        page: 'faq',
        title: 'Frequently Asked Questions',
        sections: {
            introduction: 'Find answers to the most common questions about our products, shipping, and services.',
            faqs: [
                {
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package in real-time."
                },
                {
                    question: "What is your return policy?",
                    answer: "We offer a 7-day return policy for most items. The product must be unused and in its original packaging. Please visit our returns page for more details."
                },
                {
                    question: "Do you offer international shipping?",
                    answer: "Currently, we ship primarily within India. We are working on expanding our services to international locations soon."
                },
                {
                    question: "How long does delivery take?",
                    answer: "Standard delivery typically takes 3-5 business days depending on your location. Premium shipping options are also available at checkout."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets like Paytm and Razorpay."
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Yes, we use industry-standard encryption and secure payment gateways to ensure your transaction data is always protected."
                },
                {
                    question: "Can I change or cancel my order?",
                    answer: "You can cancel or modify your order within 2 hours of placing it. After that, it may have already been processed for shipping."
                },
                {
                    question: "What should I do if my item arrives damaged?",
                    answer: "Please contact our support team immediately with photos of the damaged item. We will arrange a replacement or refund as soon as possible."
                },
                {
                    question: "Do you have a physical store?",
                    answer: "We are primarily an online-first brand, but we have a flagship store in Surat, Gujarat where you can browse our collections."
                },
                {
                    question: "How do I use a discount code?",
                    answer: "You can enter your promo code at the checkout page before finalizing your payment. The discount will be applied automatically."
                },
                {
                    question: "Are your products authentic?",
                    answer: "Absolutely. we guarantee 100% authenticity for all the products available on our website."
                },
                {
                    question: "How can I contact customer support?",
                    answer: "You can reach us via the Contact Us page, email us at hello@gmail.com, or call us at +0123 234 9568."
                },
                {
                    question: "Do I need an account to place an order?",
                    answer: "While you can guest checkout, we recommend creating an account to track orders easily and receive exclusive offers."
                },
                {
                    question: "What happens if I'm not home during delivery?",
                    answer: "Our courier partners will typically attempt delivery up to 3 times. You can also coordinate a specific time via the tracking link."
                },
                {
                    question: "Do you offer gift wrapping?",
                    answer: "Yes, we offer premium gift wrapping services for a small additional fee. You can select this option at the checkout page."
                }
            ]
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for Seeding CMS');

        // Seed Blogs
        await Blog.deleteMany({});
        await Blog.insertMany(blogsData);
        console.log('Blogs Seeded');

        // Seed Pages
        for (const page of pagesData) {
            await PageContent.findOneAndUpdate(
                { page: page.page },
                page,
                { upsert: true, new: true }
            );
        }
        console.log('Page Contents Seeded');

        // Seed Categories
        await Category.deleteMany({});
        await Category.insertMany(categoriesData);
        console.log('Categories Seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
