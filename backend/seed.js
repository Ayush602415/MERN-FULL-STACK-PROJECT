
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./src/models/product.model");

dotenv.config();

const imageUrls = {
    iphone: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",
    samsungPhone: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp",
    laptop: "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp",
    tablet: "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp",
    headphones: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
    earbuds: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
    watch: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
    camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    shoes: "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp",
    shirt: "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp",
    sunglasses: "https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp",
    backpack: "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp",
    football: "https://cdn.dummyjson.com/product-images/sports-accessories/football/thumbnail.webp",
    racket: "https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/thumbnail.webp",
    lamp: "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
    microwave: "https://cdn.dummyjson.com/product-images/kitchen-accessories/microwave-oven/thumbnail.webp",
    charger: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/thumbnail.webp"
};

const imageForProduct = (name, category) => {
    const productName = name.toLowerCase();

    if (/tablet|ipad/.test(productName)) return imageUrls.tablet;
    if (/kindle/.test(productName)) return imageUrls.tablet;
    if (/iphone|pixel|oneplus|xiaomi|galaxy s\d/.test(productName)) {
        return /samsung|galaxy/.test(productName) ? imageUrls.samsungPhone : imageUrls.iphone;
    }
    if (/laptop|macbook|xps|yoga slim|pavilion|nitro/.test(productName)) return imageUrls.laptop;
    if (/headphone|airpods max|wh-1000|quietcomfort/.test(productName)) return imageUrls.headphones;
    if (/earbud|airpods|galaxy buds|airdopes/.test(productName)) return imageUrls.earbuds;
    if (/speaker|soundbar|emberton/.test(productName)) return imageUrls.headphones;
    if (/watch|fitbit|forerunner|smartwatch/.test(productName)) return imageUrls.watch;
    if (/camera|eos|gopro|drone/.test(productName)) return imageUrls.camera;
    if (/shoe|sneaker|ultraboost|chuck taylor|air max/.test(productName)) return imageUrls.shoes;
    if (/sunglass/.test(productName)) return imageUrls.sunglasses;
    if (/backpack/.test(productName)) return imageUrls.backpack;
    if (/shirt|hoodie|jacket|jeans|blazer|down jacket/.test(productName)) return imageUrls.shirt;
    if (/football/.test(productName)) return imageUrls.football;
    if (/racket/.test(productName)) return imageUrls.racket;
    if (/lamp|bulb/.test(productName)) return imageUrls.lamp;
    if (/microwave|air fryer|pressure cooker|vacuum/.test(productName)) return imageUrls.microwave;
    if (/charger|power bank/.test(productName)) return imageUrls.charger;
    if (/yoga|dumbbell|fitness|running/.test(productName)) return imageUrls.shoes;
    if (/monitor|television|\btv\b|keyboard|mouse|router|ssd|hard drive|console|controller/.test(productName)) {
        return imageUrls.laptop;
    }
    if (category === "Fashion") return imageUrls.shirt;
    if (category === "Electronics") return imageUrls.laptop;
    return imageUrls.charger;
};

const addDescriptionDetails = (description, category) => {
    const details = {
        Electronics: "A versatile choice for everyday work, entertainment, and staying connected.",
        Accessories: "A practical addition to your everyday setup, designed to complement your essentials.",
        Fashion: "An easy-to-style addition to your wardrobe for everyday wear."
    };

    return `${description} ${details[category] || "A useful everyday essential."}`;
};

const products = [
    {
        name: "iPhone 16",
        description: "Apple smartphone with advanced camera and powerful performance.",
        price: 79999,
        images: [imageForProduct("iPhone 16", "Electronics")],
        category: "Electronics",
        brand: "Apple",
        stock: 20
    },
    {
        name: "Samsung Galaxy S25",
        description: "Samsung flagship smartphone with premium display.",
        price: 74999,
        images: [imageForProduct("Samsung Galaxy S25", "Electronics")],
        category: "Electronics",
        brand: "Samsung",
        stock: 15
    },
    {
        name: "Sony WH-1000XM5",
        description: "Wireless headphones with noise cancellation.",
        price: 24999,
        images: [imageForProduct("Sony WH-1000XM5", "Accessories")],
        category: "Accessories",
        brand: "Sony",
        stock: 25
    },
    {
        name: "MacBook Air M4",
        description: "Apple laptop with M4 chip and powerful performance.",
        price: 109999,
        images: [imageForProduct("MacBook Air M4", "Electronics")],
        category: "Electronics",
        brand: "Apple",
        stock: 10
    },
    {
        name: "Nike Air Max",
        description: "Comfortable sports shoes for everyday use.",
        price: 8999,
        images: [imageForProduct("Nike Air Max", "Fashion")],
        category: "Fashion",
        brand: "Nike",
        stock: 30
    },
    {
        name: "Apple Watch Series 10",
        description: "Smartwatch with fitness tracking features.",
        price: 42999,
        images: [imageForProduct("Apple Watch Series 10", "Electronics")],
        category: "Electronics",
        brand: "Apple",
        stock: 12
    },
    {
        name: "Dell XPS 15",
        description: "Premium laptop for productivity and development.",
        price: 149999,
        images: [imageForProduct("Dell XPS 15", "Electronics")],
        category: "Electronics",
        brand: "Dell",
        stock: 8
    },
    {
        name: "Adidas Hoodie",
        description: "Comfortable casual hoodie with premium fabric.",
        price: 2999,
        images: [imageForProduct("Adidas Hoodie", "Fashion")],
        category: "Fashion",
        brand: "Adidas",
        stock: 40
    },
    {
        name: "Logitech MX Master 3S",
        description: "Wireless ergonomic mouse for productivity.",
        price: 8999,
        images: [imageForProduct("Logitech MX Master 3S", "Accessories")],
        category: "Accessories",
        brand: "Logitech",
        stock: 22
    },
    {
        name: "Canon EOS R50",
        description: "Mirrorless camera for photography and content creation.",
        price: 64999,
        images: [imageForProduct("Canon EOS R50", "Electronics")],
        category: "Electronics",
        brand: "Canon",
        stock: 7
    },
    {
        name: "Puma Running Shoes",
        description: "Lightweight running shoes for daily workouts.",
        price: 4999,
        images: [imageForProduct("Puma Running Shoes", "Fashion")],
        category: "Fashion",
        brand: "Puma",
        stock: 35
    },
    {
        name: "JBL Flip 6",
        description: "Portable Bluetooth speaker with powerful sound.",
        price: 9999,
        images: [imageForProduct("JBL Flip 6", "Accessories")],
        category: "Accessories",
        brand: "JBL",
        stock: 18
    },
    {
        name: "Samsung 4K Monitor",
        description: "High resolution monitor for work and entertainment.",
        price: 27999,
        images: [imageForProduct("Samsung 4K Monitor", "Electronics")],
        category: "Electronics",
        brand: "Samsung",
        stock: 11
    },
    {
        name: "Levi's Denim Jacket",
        description: "Classic denim jacket with a timeless design.",
        price: 5999,
        images: [imageForProduct("Levi's Denim Jacket", "Fashion")],
        category: "Fashion",
        brand: "Levis",
        stock: 16
    },
    {
        name: "Kindle Paperwhite",
        description: "E-reader with glare-free display and adjustable lighting.",
        price: 14999,
        images: [imageForProduct("Kindle Paperwhite", "Electronics")],
        category: "Electronics",
        brand: "Amazon",
        stock: 14
    }
];

const additionalProducts = [
    ["OnePlus 13", "Flagship smartphone with a vibrant display and fast performance.", 69999, "Electronics", "OnePlus", 18],
    ["Google Pixel 9", "Smartphone with a clean Android experience and advanced camera.", 79999, "Electronics", "Google", 14],
    ["Xiaomi 14", "Compact flagship smartphone with a high-resolution camera.", 59999, "Electronics", "Xiaomi", 20],
    ["iPad Air", "Versatile tablet for creativity, productivity, and entertainment.", 59999, "Electronics", "Apple", 16],
    ["Samsung Galaxy Tab S10", "Large-screen tablet for work, drawing, and streaming.", 84999, "Electronics", "Samsung", 9],
    ["Lenovo Yoga Slim 7", "Thin and lightweight laptop for everyday productivity.", 89999, "Electronics", "Lenovo", 11],
    ["HP Pavilion Plus 14", "Compact laptop with a crisp display for work and study.", 74999, "Electronics", "HP", 13],
    ["Acer Nitro V 15", "Gaming laptop with dedicated graphics and a high-refresh display.", 89999, "Electronics", "Acer", 8],
    ["LG OLED 55-inch TV", "OLED television with rich contrast for movies and gaming.", 129999, "Electronics", "LG", 6],
    ["Samsung HW-B550 Soundbar", "TV soundbar with wireless subwoofer and clear dialogue.", 21999, "Electronics", "Samsung", 15],
    ["Anker 65W USB-C Charger", "Compact fast charger for compatible phones and laptops.", 4999, "Accessories", "Anker", 32],
    ["Apple AirPods Pro", "Wireless earbuds with active noise cancellation.", 24999, "Accessories", "Apple", 20],
    ["Samsung Galaxy Buds FE", "Comfortable wireless earbuds with immersive sound.", 8999, "Accessories", "Samsung", 24],
    ["Fitbit Charge 6", "Fitness tracker with heart-rate and activity monitoring.", 14999, "Electronics", "Fitbit", 18],
    ["Garmin Forerunner 255", "GPS running watch with training and recovery insights.", 34999, "Electronics", "Garmin", 7],
    ["GoPro HERO12 Black", "Action camera for capturing adventures in high resolution.", 39999, "Electronics", "GoPro", 9],
    ["DJI Mini 3", "Lightweight camera drone for travel and aerial photography.", 54999, "Electronics", "DJI", 5],
    ["SanDisk Extreme Portable SSD 1TB", "Rugged portable solid-state drive for quick backups.", 10999, "Accessories", "SanDisk", 21],
    ["WD My Passport 2TB", "Portable hard drive for storing and backing up files.", 6999, "Accessories", "Western Digital", 17],
    ["Keychron K2 Mechanical Keyboard", "Wireless mechanical keyboard for work and gaming.", 8999, "Accessories", "Keychron", 12],
    ["Razer DeathAdder V3", "Ergonomic gaming mouse with precise optical tracking.", 6999, "Accessories", "Razer", 19],
    ["TP-Link Archer AX55 Router", "Dual-band Wi-Fi router for reliable home connectivity.", 9999, "Electronics", "TP-Link", 10],
    ["Philips Hue White Bulb", "Smart LED bulb with app and voice assistant control.", 2499, "Accessories", "Philips", 30],
    ["Kindle Scribe", "Large-screen e-reader for reading and handwritten notes.", 39999, "Electronics", "Amazon", 8],
    ["Sony PlayStation 5 Slim", "Gaming console for immersive next-generation games.", 54999, "Electronics", "Sony", 7],
    ["Xbox Wireless Controller", "Wireless controller for Xbox and compatible devices.", 5999, "Accessories", "Microsoft", 22],
    ["Nintendo Switch OLED", "Portable gaming console with a vivid OLED display.", 32999, "Electronics", "Nintendo", 9],
    ["Bose QuietComfort Headphones", "Over-ear headphones with noise cancellation.", 29999, "Accessories", "Bose", 11],
    ["Marshall Emberton II", "Portable Bluetooth speaker with stereo sound.", 16999, "Accessories", "Marshall", 14],
    ["New Balance 574", "Everyday sneakers with a classic design and cushioned fit.", 8999, "Fashion", "New Balance", 25],
    ["Adidas Ultraboost Light", "Responsive running shoes designed for daily training.", 15999, "Fashion", "Adidas", 18],
    ["Converse Chuck Taylor All Star", "Canvas high-top sneakers with a timeless silhouette.", 4999, "Fashion", "Converse", 28],
    ["Reebok Classic Leather", "Minimal leather sneakers for comfortable everyday wear.", 6999, "Fashion", "Reebok", 21],
    ["Puma Essentials Jacket", "Lightweight zip-up jacket for casual layering.", 3999, "Fashion", "Puma", 20],
    ["Levi's 511 Slim Jeans", "Slim-fit denim jeans with a comfortable everyday cut.", 4999, "Fashion", "Levis", 24],
    ["H&M Oxford Shirt", "Versatile button-down shirt for casual and smart outfits.", 1999, "Fashion", "H&M", 35],
    ["Zara Tailored Blazer", "Modern tailored blazer for work and formal occasions.", 7999, "Fashion", "Zara", 12],
    ["Uniqlo Ultra Light Down Jacket", "Packable lightweight jacket for cool-weather layering.", 6999, "Fashion", "Uniqlo", 16],
    ["The North Face Borealis Backpack", "Everyday backpack with organized storage and padded straps.", 11999, "Fashion", "The North Face", 10],
    ["Fossil Gen 6 Smartwatch", "Smartwatch with health tracking and smartphone notifications.", 19999, "Electronics", "Fossil", 9],
    ["Ray-Ban Wayfarer Sunglasses", "Classic sunglasses with a durable lightweight frame.", 9999, "Fashion", "Ray-Ban", 14],
    ["Wildcraft 45L Trekking Backpack", "Spacious backpack for weekend hikes and travel.", 4999, "Fashion", "Wildcraft", 18],
    ["Decathlon Yoga Mat", "Non-slip exercise mat for yoga and home workouts.", 1499, "Accessories", "Decathlon", 40],
    ["Nike Academy Football", "Durable training football for practice and recreation.", 1999, "Accessories", "Nike", 27],
    ["Yonex Nanoray Badminton Racket", "Lightweight badminton racket for recreational play.", 3499, "Accessories", "Yonex", 16],
    ["Cultsport Yoga Mat", "Cushioned yoga mat with a textured non-slip surface.", 1799, "Accessories", "Cultsport", 33],
    ["Boldfit Adjustable Dumbbells", "Compact adjustable dumbbells for strength training at home.", 4999, "Accessories", "Boldfit", 13],
    ["Milton Thermosteel Bottle", "Insulated stainless-steel bottle for hot and cold drinks.", 1299, "Accessories", "Milton", 45],
    ["Prestige Deluxe Pressure Cooker", "Durable pressure cooker for convenient everyday cooking.", 2999, "Accessories", "Prestige", 19],
    ["Philips Digital Air Fryer", "Air fryer for preparing crispy meals with less oil.", 9999, "Accessories", "Philips", 8],
    ["Eureka Forbes Quick Clean Vacuum", "Compact vacuum cleaner for everyday home cleaning.", 6999, "Accessories", "Eureka Forbes", 10],
    ["IKEA FADO Table Lamp", "Soft-glow table lamp for bedrooms and living spaces.", 1999, "Accessories", "IKEA", 23],
    ["Portronics 20000mAh Power Bank", "Portable high-capacity power bank with fast charging.", 2499, "Accessories", "Portronics", 29],
    ["Samsung 28L Convection Microwave", "Convection microwave oven for versatile home cooking.", 18999, "Accessories", "Samsung", 6],
    ["boAt Airdopes 141", "True wireless earbuds with a compact charging case.", 1499, "Accessories", "boAt", 38]
].map(([name, description, price, category, brand, stocks]) => ({
    name,
    description,
    price,
    category,
    brand,
    stocks,
    image: [imageForProduct(name, category)]
}));

const catalogFamilies = [
    ["Apple iPhone 16", "Smartphone with a bright display and advanced camera system.", 79999, "Electronics", "Apple", 20],
    ["Samsung Galaxy S25", "Flagship smartphone with a vivid display and fast performance.", 74999, "Electronics", "Samsung", 18],
    ["Google Pixel 9", "Smartphone with a clean interface and computational photography.", 79999, "Electronics", "Google", 14],
    ["OnePlus 13", "High-performance smartphone with a fluid display.", 69999, "Electronics", "OnePlus", 16],
    ["Xiaomi 14", "Compact smartphone with a detailed camera system.", 59999, "Electronics", "Xiaomi", 20],
    ["Apple MacBook Air M4", "Lightweight laptop for work, study, and creative tasks.", 109999, "Electronics", "Apple", 10],
    ["Dell XPS 15", "Premium laptop with a high-resolution display.", 149999, "Electronics", "Dell", 8],
    ["Lenovo Yoga Slim 7", "Thin laptop designed for everyday productivity.", 89999, "Electronics", "Lenovo", 11],
    ["HP Pavilion Plus 14", "Compact laptop for work, study, and entertainment.", 74999, "Electronics", "HP", 13],
    ["Acer Nitro V 15", "Gaming laptop with dedicated graphics.", 89999, "Electronics", "Acer", 8],
    ["Apple iPad Air", "Versatile tablet for creativity and entertainment.", 59999, "Electronics", "Apple", 16],
    ["Samsung Galaxy Tab S10", "Large-screen tablet for reading and productivity.", 84999, "Electronics", "Samsung", 9],
    ["Microsoft Surface Pro", "Portable tablet and laptop for everyday work.", 99999, "Electronics", "Microsoft", 7],
    ["Xiaomi Pad 7", "Entertainment tablet with a crisp, responsive display.", 27999, "Electronics", "Xiaomi", 14],
    ["OnePlus Pad 2", "Large-screen tablet for streaming and multitasking.", 39999, "Electronics", "OnePlus", 12],
    ["LG OLED 55-inch TV", "OLED television with rich contrast and vivid color.", 129999, "Electronics", "LG", 6],
    ["Samsung 4K Monitor", "High-resolution monitor for work and entertainment.", 27999, "Electronics", "Samsung", 11],
    ["Dell UltraSharp 27", "27-inch monitor with detailed color reproduction.", 45999, "Electronics", "Dell", 8],
    ["Sony Bravia 4K TV", "4K television with clear picture and immersive sound.", 89999, "Electronics", "Sony", 7],
    ["BenQ MOBIUZ Gaming Monitor", "Gaming monitor with a smooth high-refresh display.", 34999, "Electronics", "BenQ", 9],
    ["Canon EOS R50", "Mirrorless camera for photography and video.", 64999, "Electronics", "Canon", 7],
    ["Sony Alpha a6400", "Mirrorless camera with fast autofocus.", 79999, "Electronics", "Sony", 6],
    ["Nikon Z50", "Compact mirrorless camera for travel and everyday use.", 69999, "Electronics", "Nikon", 5],
    ["GoPro HERO12", "Action camera for capturing outdoor adventures.", 39999, "Electronics", "GoPro", 9],
    ["DJI Mini 3", "Lightweight camera drone for travel and aerial video.", 54999, "Electronics", "DJI", 5],
    ["Sony WH-1000XM5", "Wireless headphones with active noise cancellation.", 24999, "Accessories", "Sony", 25],
    ["Apple AirPods Pro", "Wireless earbuds with noise cancellation.", 24999, "Accessories", "Apple", 20],
    ["Samsung Galaxy Buds FE", "Wireless earbuds with a comfortable fit.", 8999, "Accessories", "Samsung", 24],
    ["Bose QuietComfort", "Over-ear headphones for focused listening.", 29999, "Accessories", "Bose", 11],
    ["JBL Flip 6", "Portable Bluetooth speaker with powerful sound.", 9999, "Accessories", "JBL", 18],
    ["Logitech MX Master 3S", "Wireless ergonomic mouse for productivity.", 8999, "Accessories", "Logitech", 22],
    ["Keychron K2 Keyboard", "Wireless mechanical keyboard for work and gaming.", 8999, "Accessories", "Keychron", 12],
    ["Razer DeathAdder V3", "Ergonomic gaming mouse with precise tracking.", 6999, "Accessories", "Razer", 19],
    ["Anker 65W USB-C Charger", "Compact fast charger for compatible devices.", 4999, "Accessories", "Anker", 32],
    ["SanDisk Extreme SSD 1TB", "Portable solid-state drive for quick backups.", 10999, "Accessories", "SanDisk", 21],
    ["Fitbit Charge 6", "Fitness tracker for activity and heart-rate monitoring.", 14999, "Electronics", "Fitbit", 18],
    ["Garmin Forerunner 255", "GPS running watch with training insights.", 34999, "Electronics", "Garmin", 7],
    ["Apple Watch Series 10", "Smartwatch with fitness and health features.", 42999, "Electronics", "Apple", 12],
    ["Fossil Gen 6 Smartwatch", "Smartwatch with activity tracking and notifications.", 19999, "Electronics", "Fossil", 9],
    ["Philips Hue Smart Bulb", "Smart LED bulb with app and voice control.", 2499, "Accessories", "Philips", 30],
    ["Nike Air Max", "Everyday sneakers with a cushioned sole.", 8999, "Fashion", "Nike", 30],
    ["Adidas Ultraboost", "Responsive running shoes for daily training.", 15999, "Fashion", "Adidas", 18],
    ["New Balance 574", "Classic sneakers with a comfortable everyday fit.", 8999, "Fashion", "New Balance", 25],
    ["Converse Chuck Taylor", "Canvas sneakers with a timeless silhouette.", 4999, "Fashion", "Converse", 28],
    ["Puma Running Shoes", "Lightweight running shoes for daily workouts.", 4999, "Fashion", "Puma", 35],
    ["Levis Denim Jacket", "Classic denim jacket for everyday layering.", 5999, "Fashion", "Levis", 16],
    ["Adidas Essentials Hoodie", "Soft casual hoodie for everyday wear.", 2999, "Fashion", "Adidas", 40],
    ["Zara Tailored Blazer", "Modern blazer for work and formal occasions.", 7999, "Fashion", "Zara", 12],
    ["The North Face Backpack", "Everyday backpack with organized storage.", 11999, "Fashion", "The North Face", 10],
    ["Ray-Ban Wayfarer Sunglasses", "Lightweight sunglasses with a classic frame.", 9999, "Fashion", "Ray-Ban", 14]
];

const generatedProducts = catalogFamilies.flatMap(
    ([name, description, price, category, brand, stocks]) =>
        ["Black", "White", "Blue", "Silver", "Green"].map((color, index) => {
            const productName = `${name} ${color}`;
            const imageSeed = encodeURIComponent(productName.toLowerCase().replace(/\s+/g, "-"));

            return {
                name: productName,
                description: `${description} Available in ${color}.`,
                price: price + index * 100,
                category,
                brand,
                stocks: stocks + index,
                image: [`https://picsum.photos/seed/shopsphere-${imageSeed}/600/600`]
            };
        })
);

const seedProductsData = [
    ...products.map(({ images, stock, ...product }) => ({
        ...product,
        image: images,
        stocks: stock
    })),
    ...additionalProducts,
    ...generatedProducts
].map((product) => ({
    ...product,
    description: addDescriptionDetails(product.description, product.category),
    reviews: [{ name: "Alex Morgan", rating: 5, comment: "Great product, just as described." }],
    numberOfReviews: 1,
    ratings: 5
}));

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected Successfully!");

        const result = await Product.bulkWrite(seedProductsData.map((product) => ({
            updateOne: {
                filter: { name: product.name },
                update: { $set: product },
                upsert: true
            }
        })));

        console.log(`${result.upsertedCount} new products added; ${result.modifiedCount} existing seed products updated.`);

    } catch (error) {
        console.log("Seeding Error:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("Database Connection Closed");
    }
};

seedProducts();
