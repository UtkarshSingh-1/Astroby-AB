import { prisma } from '../src/lib/prisma';

const services = [
    {
        name: 'COMPLETE CHART ANALYSIS',
        slug: 'complete-chart-analysis',
        price: 1500,
        description: 'A comprehensive analysis of your birth chart covering all major aspects of life including career, health, and relationships.',
        icon: 'Star',
        features: [
            'Detailed birth chart analysis',
            'Life-long predictions',
            'Remedial measures',
            'Dasha analysis',
            'Panchang insights'
        ]
    },
    {
        name: 'RELATIONSHIP & MARRIAGE',
        slug: 'relationship-marriage',
        price: 999,
        description: 'Detailed compatibility and relationship analysis for better understanding of your partner and timing for marriage.',
        icon: 'Heart',
        features: [
            'Gun Milan / Compatibility',
            'Marriage timing',
            'Relationship longevity',
            'Mars (Mangal) Dosha check',
            'Effective remedies'
        ]
    },
    {
        name: 'CAREER & FINANCE',
        slug: 'career-finance',
        price: 999,
        description: 'Insights into your professional life and financial growth. Find the right time for business ventures or job changes.',
        icon: 'Briefcase',
        features: [
            'Profession selection',
            'Wealth yoga analysis',
            'Business vs Job',
            'Promotion timing',
            'Financial stability guide'
        ]
    },
    {
        name: 'EDUCATIONAL GUIDANCE',
        slug: 'educational-guidance',
        price: 999,
        description: 'Strategic advice for academic success and learning paths based on your intellectual potential and planetary positions.',
        icon: 'BookOpen',
        features: [
            'Stream selection',
            'Competitive exam success',
            'Higher education abroad',
            'Focus & memory remedies',
            'Skill development timing'
        ]
    },
    {
        name: 'HEALTH & WELLBEING',
        slug: 'health-wellbeing',
        price: 999,
        description: 'Vedic perspectives on physical and mental health. Identify sensitive periods and suggested lifestyle adjustments based on your chart.',
        icon: 'Stethoscope',
        features: [
            'Balarishta assessment',
            'Sensitive health areas',
            'Recovery timing',
            'Mental peace remedies',
            'Ayurvedic lifestyle alignment'
        ]
    },
    {
        name: 'GEMSTONE CONSULTATION',
        slug: 'gemstone-consultation',
        price: 999,
        description: 'Personalized gemstone recommendations for positive energy and overcoming obstacles in specific life areas.',
        icon: 'Gem',
        features: [
            'Life-stone analysis',
            'Benefic planet strengthening',
            'Obstacle removal gems',
            'Wearing instructions',
            'Gem quality guidance'
        ]
    }
];

async function main() {
    console.log('Starting service restoration...');

    // 1. Correct the mislabeled service name if it exists
    const mabeled = await prisma.service.findFirst({
        where: { name: 'Health and disease astrology' }
    });

    if (mabeled) {
        console.log('Found mislabeled service. Correcting to RELATIONSHIP & MARRIAGE...');
        await prisma.service.update({
            where: { id: mabeled.id },
            data: {
                name: 'RELATIONSHIP & MARRIAGE',
                slug: 'relationship-marriage',
                price: 999,
                description: 'Detailed compatibility and relationship analysis for better understanding of your partner and timing for marriage.',
                icon: 'Heart',
                features: [
                    'Gun Milan / Compatibility',
                    'Marriage timing',
                    'Relationship longevity',
                    'Mars (Mangal) Dosha check',
                    'Effective remedies'
                ]
            }
        });
    }

    // 2. Upsert all services to ensure they exist and are correct
    for (const service of services) {
        console.log(`Checking service: ${service.name}...`);
        await prisma.service.upsert({
            where: { name: service.name },
            update: {
                slug: service.slug,
                price: service.price,
                description: service.description,
                icon: service.icon,
                features: service.features,
            },
            create: {
                name: service.name,
                slug: service.slug,
                price: service.price,
                description: service.description,
                icon: service.icon,
                features: service.features,
            },
        });
    }

    console.log('Service restoration complete.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
