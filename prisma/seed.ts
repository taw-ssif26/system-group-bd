import {
  PrismaClient,
  AdminRole,
  Industry,
  ProjectStatus,
  NewsStatus,
  NewsCategory,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const OFFICIAL_LOGO =
  'https://systemgroupbd.com/wp-content/uploads/2023/11/system-group-logo.png'

const PROJECT_IMAGES = {
  imperial:
    'https://systemgroupbd.com/wp-content/uploads/2023/11/system-imperial-complex.jpg',
  chakaria:
    'https://systemgroupbd.com/wp-content/uploads/2023/11/system-chakaria-complex.jpg',
  sattar:
    'https://systemgroupbd.com/wp-content/uploads/2023/11/portland-satter-tower.jpg',
  royalBarber:
    'https://systemgroupbd.com/wp-content/uploads/2023/11/royal-barber-banner.jpg',
  flood:
    'https://systemgroupbd.com/wp-content/uploads/2023/11/flood-relief-satkania.jpg',
  gmbf:
    'https://systemgroupbd.com/wp-content/uploads/2023/11/gmbf-award-malaysia.jpg',
}

async function main() {
  console.log('Seeding System Group database...')

  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@2024!',
    12
  )

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@systemgroupbd.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@systemgroupbd.com',
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  })

  console.log('Admin:', admin.email)

  const leaders = [
    {
      id: 'md-fazlul-azim',
      name: 'Md Fazlul Azim',
      position: 'Chairman',
      biography:
        'Md Fazlul Azim is the founder and Chairman of System Group Bangladesh. Since establishing the group in 2009, he has led its evolution from real estate into a diversified business ecosystem spanning construction, ICT, telecommunications, trading, lifestyle and allied sectors.',
      portrait: null,
      quote:
        'To build a revolutionary business empire that sets the benchmark for innovation, redefines quality standards, and exceeds customer expectations.',
      displayOrder: 1,
    },
    {
      id: 'salena-akther',
      name: 'Salena Akther',
      position: 'Managing Director',
      biography:
        'Salena Akther serves as Managing Director of System Group Bangladesh, supporting operational excellence and strategic alignment across the group portfolio.',
      portrait: null,
      quote: null,
      displayOrder: 2,
    },
    {
      id: 'misbah-uddin-kadery',
      name: 'Misbah Uddin Kadery',
      position: 'Executive Director',
      biography:
        'Misbah Uddin Kadery serves as Executive Director of System Group Bangladesh, driving business development and market expansion across the group.',
      portrait: null,
      quote: null,
      displayOrder: 3,
    },
  ]

  for (const member of leaders) {
    await prisma.leadershipMember.upsert({
      where: { id: member.id },
      update: member,
      create: {
        isPublished: true,
        ...member,
      },
    })
  }

  console.log('Leadership seeded')

  const concerns = [
    {
      id: 'system-builders-limited',
      name: 'System Builders Limited',
      slug: 'system-builders-limited',
      shortDescription:
        'Construction and development arm responsible for landmark structures across Chattogram.',
      description:
        'System Builders Limited is the construction arm of System Group, responsible for major commercial and residential developments including System Imperial Complex and other landmark projects.',
      industry: Industry.CONSTRUCTION,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      id: 'system-properties-limited',
      name: 'System Properties Limited',
      slug: 'system-properties-limited',
      shortDescription:
        'Real estate development delivering landmark residential and commercial properties.',
      description:
        'System Properties Limited represents System Group in real estate development, including System Chakaria Complex and Portland Satter Tower.',
      industry: Industry.REAL_ESTATE,
      isFeatured: true,
      displayOrder: 2,
    },
    {
      id: 'system-trading-limited',
      name: 'System Trading Limited',
      slug: 'system-trading-limited',
      shortDescription:
        'Building materials, steel rods, cement, ceramics, electrical fixtures and construction supplies.',
      description:
        'System Trading Limited specializes in essential building materials including steel rods, cement, ceramics, electrical fixtures and construction supplies.',
      industry: Industry.TRADING,
      isFeatured: true,
      displayOrder: 3,
    },
    {
      id: 'system-technologies',
      name: 'System Technologies',
      slug: 'system-technologies',
      shortDescription:
        'ICT expansion focused on property technology, immersive virtual tours and smart infrastructure.',
      description:
        'System Technologies represents System Group’s ICT expansion, focusing on property management platforms, immersive virtual tours, smart city developments and technology infrastructure.',
      industry: Industry.ICT,
      isFeatured: true,
      displayOrder: 4,
    },
    {
      id: 'system-phone-limited',
      name: 'System Phone Limited',
      slug: 'system-phone-limited',
      shortDescription:
        'Telecom and mobile retailing through a network of brandshops and retail outlets.',
      description:
        'System Phone Limited manages mobile and electronics retail operations across Chattogram and surrounding markets, including major smartphone brandshops and retail outlets.',
      industry: Industry.TELECOM,
      isFeatured: true,
      displayOrder: 5,
    },
    {
      id: 'royal-barber',
      name: 'Royal Barber',
      slug: 'royal-barber',
      shortDescription:
        'Luxury men’s grooming salon in Chattogram offering precision cuts, beard trims and spa treatments.',
      description:
        'Royal Barber is a premium men’s grooming destination offering precision haircuts, beard trims and spa treatments.',
      industry: Industry.GROOMING,
      isFeatured: false,
      displayOrder: 6,
    },
    {
      id: 'gents-world-limited',
      name: 'Gents World Limited',
      slug: 'gents-world-limited',
      shortDescription: 'Lifestyle and retail business.',
      description: 'Gents World Limited is part of System Group’s lifestyle and retail portfolio.',
      industry: Industry.LIFESTYLE,
      isFeatured: false,
      displayOrder: 7,
    },
    {
      id: 'ladies-world-limited',
      name: 'Ladies World Limited',
      slug: 'ladies-world-limited',
      shortDescription: 'Lifestyle and retail business.',
      description: 'Ladies World Limited is part of System Group’s lifestyle and retail portfolio.',
      industry: Industry.LIFESTYLE,
      isFeatured: false,
      displayOrder: 8,
    },
    {
      id: 'bushra-electronics',
      name: 'Bushra Electronics',
      slug: 'bushra-electronics',
      shortDescription: 'Electronics and consumer technology retail.',
      description: 'Bushra Electronics operates within System Group’s electronics and technology portfolio.',
      industry: Industry.ELECTRONICS,
      isFeatured: false,
      displayOrder: 9,
    },
    {
      id: 'system-fisheries-limited',
      name: 'System Fisheries Limited',
      slug: 'system-fisheries-limited',
      shortDescription:
        'Agricultural and fisheries venture focused on sustainable fish farming.',
      description:
        'System Fisheries Limited contributes to agricultural advancement through environmentally conscious fish farming and community employment.',
      industry: Industry.AGRICULTURE,
      isFeatured: false,
      displayOrder: 10,
    },
  ]

  for (const concern of concerns) {
    await prisma.sisterConcern.upsert({
      where: { slug: concern.slug },
      update: concern,
      create: {
        isPublished: true,
        ...concern,
      },
    })
  }

  console.log('Sister concerns seeded')

  const projects = [
    {
      id: 'system-imperial-complex',
      name: 'System Imperial Complex',
      slug: 'system-imperial-complex',
      description:
        'A landmark commercial complex on Kapasgola Road, Chawkbazar, Chattogram, combining retail, technology and mobile brand outlets.',
      location: 'Chawkbazar, Chattogram',
      status: ProjectStatus.COMPLETED,
      investment: null,
      completionYear: 2023,
      isFeatured: true,
      displayOrder: 1,
      featuredImage: PROJECT_IMAGES.imperial,
      sisterConcernId: 'system-builders-limited',
    },
    {
      id: 'system-aziz-complex',
      name: 'System Aziz Complex',
      slug: 'system-aziz-complex',
      description:
        'A mixed-use development combining commercial and residential spaces.',
      location: 'Rajakhali, Chattogram',
      status: ProjectStatus.ONGOING,
      investment: null,
      completionYear: null,
      isFeatured: true,
      displayOrder: 2,
      featuredImage: null,
      sisterConcernId: 'system-builders-limited',
    },
    {
      id: 'system-chakaria-complex',
      name: 'System Chakaria Complex',
      slug: 'system-chakaria-complex',
      description:
        'A modern shopping mall and landmark commercial development in Chakaria.',
      location: 'Chakaria, Cox’s Bazar',
      status: ProjectStatus.UPCOMING,
      investment: null,
      completionYear: null,
      isFeatured: true,
      displayOrder: 3,
      featuredImage: PROJECT_IMAGES.chakaria,
      sisterConcernId: 'system-properties-limited',
    },
    {
      id: 'portland-satter-tower',
      name: 'Portland Satter Tower',
      slug: 'portland-satter-tower',
      description:
        'System Group’s pioneering real estate project, originally known as System Sattar Tower.',
      location: 'Chattogram',
      status: ProjectStatus.COMPLETED,
      investment: null,
      completionYear: 2009,
      isFeatured: true,
      displayOrder: 4,
      featuredImage: PROJECT_IMAGES.sattar,
      sisterConcernId: 'system-properties-limited',
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: {
        isPublished: true,
        ...project,
      },
    })
  }

  console.log('Projects seeded')

  await prisma.projectImage.upsert({
    where: { id: 'imperial-main-image' },
    update: {
      url: PROJECT_IMAGES.imperial,
    },
    create: {
      id: 'imperial-main-image',
      projectId: 'system-imperial-complex',
      url: PROJECT_IMAGES.imperial,
      altText: 'System Imperial Complex',
      caption: 'System Imperial Complex, Chattogram',
      displayOrder: 1,
    },
  })

  await prisma.projectImage.upsert({
    where: { id: 'chakaria-main-image' },
    update: {
      url: PROJECT_IMAGES.chakaria,
    },
    create: {
      id: 'chakaria-main-image',
      projectId: 'system-chakaria-complex',
      url: PROJECT_IMAGES.chakaria,
      altText: 'System Chakaria Complex',
      caption: 'System Chakaria Complex',
      displayOrder: 1,
    },
  })

  await prisma.projectImage.upsert({
    where: { id: 'sattar-main-image' },
    update: {
      url: PROJECT_IMAGES.sattar,
    },
    create: {
      id: 'sattar-main-image',
      projectId: 'portland-satter-tower',
      url: PROJECT_IMAGES.sattar,
      altText: 'Portland Satter Tower',
      caption: 'Portland Satter Tower',
      displayOrder: 1,
    },
  })

  const outletData = [
    'Samsung Brandshop',
    'Oppo Brandshop',
    'Mi Brandshop',
    'Vivo Brandshop',
    'Tecno Brandshop',
    'Infinix Brandshop',
    'Walton Brandshop',
    'Chittagong Communication',
    'Chittagong Communication Stationery',
    'Efti Communication',
    'Kadery Telecom',
    'Kanchana Telecom',
    'Momtaj Communication',
    'EB Surveillance',
    'A.Kashem Telecom',
    'Satkania Telecom',
    'National Communication',
    'Smart Telecom',
  ]

  for (let i = 0; i < outletData.length; i++) {
    const name = outletData[i]

    await prisma.outlet.upsert({
      where: { id: `system-phone-outlet-${i + 1}` },
      update: {
        name,
        type: name.includes('Brandshop') ? 'showroom' : 'retail',
      },
      create: {
        id: `system-phone-outlet-${i + 1}`,
        name,
        type: name.includes('Brandshop') ? 'showroom' : 'retail',
        address:
          'System Group retail network, Chattogram, Bangladesh',
        city: 'Chattogram',
        isActive: true,
        sisterConcernId: 'system-phone-limited',
      },
    })
  }

  await prisma.outlet.upsert({
    where: { id: 'hq-chattogram' },
    update: {
      address:
        'System Imperial Complex (6th Floor), Kapasgola Road, Chawkbazar, Chattogram, Bangladesh',
      city: 'Chattogram',
    },
    create: {
      id: 'hq-chattogram',
      name: 'System Group Headquarters',
      type: 'office',
      address:
        'System Imperial Complex (6th Floor), Kapasgola Road, Chawkbazar, Chattogram, Bangladesh',
      city: 'Chattogram',
      isActive: true,
      sisterConcernId: 'system-builders-limited',
    },
  })

  console.log('Outlets seeded')

  const settings = [
    {
      key: 'site_name',
      value: 'System Group Bangladesh',
    },
    {
      key: 'tagline',
      value: 'System Group – Xplore beyond!',
    },
    {
      key: 'established',
      value: '2009',
    },
    {
      key: 'headquarters',
      value: 'Chattogram, Bangladesh',
    },
    {
      key: 'stat_projects',
      value: '25+',
    },
    {
      key: 'stat_employees',
      value: '200+',
    },
    {
      key: 'stat_investment',
      value: '50+ Million USD',
    },
    {
      key: 'about_description',
      value:
        'Established in 2009, System Group began as a real estate venture offering a distinctive blend of security and innovation. Now, we are transforming our real estate business into a dynamic powerhouse by diversifying into the IT sector, lifestyle, and tourism. Embrace smart city development, tech hubs, and wellness residences. A convergence of modern living, environmental consciousness, and technological advancement defines our unique approach.',
    },
    {
      key: 'site_logo',
      value: OFFICIAL_LOGO,
    },
    {
      key: 'address',
      value:
        'System Imperial Complex (6th Floor), Kapasgola Road, Chawkbazar, Chattogram, Bangladesh',
    },
    {
      key: 'phone',
      value: '+880 9639 290 303',
    },
    {
      key: 'phone_2',
      value: '+880 1610 001 383',
    },
    {
      key: 'email',
      value: 'info@systemgroupbd.com',
    },
    {
      key: 'official_website',
      value: 'https://systemgroupbd.com',
    },
    {
      key: 'office_hours',
      value: '10:00 AM - 08:00 PM, Saturday-Thursday',
    },
    {
      key: 'seo_title',
      value: 'System Group Bangladesh – Xplore beyond!',
    },
    {
      key: 'seo_description',
      value:
        'System Group Bangladesh, established in 2009, is a diversified business group operating across real estate, construction, ICT, telecommunications, trading, lifestyle, electronics and agriculture.',
    },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('Settings seeded')

  console.log(
    '\nSeed complete. Change the admin password before going live.'
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
