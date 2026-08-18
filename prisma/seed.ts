import { PrismaClient, AdminRole, Industry, ProjectStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding System Group database...')

  // ── ADMIN USER ──────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@2024!', 12)
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

  // ── LEADERSHIP ──────────────────────────────────────────────
  const leaders = [
    {
      id: 'md-fazlul-azim',
      name: 'Md Fazlul Azim',
      position: 'Chairman',
      biography: 'Md Fazlul Azim is the visionary founder and Chairman of System Group Bangladesh. Since establishing the group in 2009, he has led the company from a real estate venture into a diversified business ecosystem spanning construction, ICT, telecommunications, trading, lifestyle, and agriculture.',
      quote: 'To build a revolutionary business empire that sets the benchmark for innovation, redefines quality standards, and exceeds customer expectations.',
      displayOrder: 1,
    },
    {
      id: 'salena-akther',
      name: 'Salena Akther',
      position: 'Managing Director',
      biography: 'Salena Akther serves as Managing Director of System Group Bangladesh, driving operational excellence and strategic expansion across the group portfolio.',
      displayOrder: 2,
    },
    {
      id: 'misbah-uddin-kadery',
      name: 'Misbah Uddin Kadery',
      position: 'Executive Director',
      biography: 'Misbah Uddin Kadery is the Executive Director of System Group Bangladesh, overseeing key business development initiatives and growth across the construction and real estate arms.',
      displayOrder: 3,
    },
  ]

  for (const member of leaders) {
    await prisma.leadershipMember.upsert({
      where: { id: member.id },
      update: member,
      create: { isPublished: true, ...member },
    })
  }
  console.log('Leadership seeded')

  // ── SISTER CONCERNS ─────────────────────────────────────────
  const concerns = [
    {
      id: 'system-properties-limited',
      name: 'System Properties Limited',
      slug: 'system-properties-limited',
      shortDescription: 'Premier real estate development delivering landmark residential and commercial properties since 2009.',
      description: 'System Properties Limited emerged as a trailblazer in Bangladesh real estate since its establishment in 2009. Their commitment to blending security and innovation has solidified their standing as a haven for discerning investors and residents. Their portfolio includes the System Chakaria Complex, System Dove Tower, and the Portland Sattar Tower.',
      industry: Industry.REAL_ESTATE,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      id: 'system-builders-limited',
      name: 'System Builders Limited',
      slug: 'system-builders-limited',
      shortDescription: 'Construction powerhouse responsible for iconic structures across Chattogram.',
      description: 'Launched in 2011, System Builders Limited is the construction arm of System Group Bangladesh. It is responsible for iconic structures including System Aziz Tower, the System Imperial Complex, System Hill Park, and System SI Park. The company specialises in mixed-use commercial and residential developments.',
      industry: Industry.CONSTRUCTION,
      isFeatured: true,
      displayOrder: 2,
    },
    {
      id: 'system-technologies',
      name: 'System Technologies',
      slug: 'system-technologies',
      shortDescription: "Driving Bangladesh's digital transformation through ICT innovation and prop-tech solutions.",
      description: "System Technologies represents System Group's strategic foray into Information and Communication Technology. The venture envisions futuristic property management platforms and immersive virtual tours that reshape engagement, offering a glimpse into limitless possibilities and contributing to smart city development.",
      industry: Industry.ICT,
      isFeatured: true,
      displayOrder: 3,
    },
    {
      id: 'system-trading-limited',
      name: 'System Trading Limited',
      slug: 'system-trading-limited',
      shortDescription: 'Reliable source for construction materials including rods, cement, ceramics, and electrical items.',
      description: 'System Trading Ltd. is a prominent player in the trading industry, specialising in a diverse range of essential building materials including rods, cement, ceramics, and electrical items. The company meticulously sources products from trusted suppliers, ensuring every item meets stringent quality standards.',
      industry: Industry.TRADING,
      isFeatured: false,
      displayOrder: 4,
    },
    {
      id: 'a-kashem-telecom',
      name: 'A. Kashem Telecom',
      slug: 'a-kashem-telecom',
      shortDescription: 'Telecommunications retail operations serving Chattogram and surrounding regions.',
      description: 'A. Kashem Telecom is part of System Group telecommunications retail network, focused on bringing modern connectivity solutions and mobile products to communities across Bangladesh. The venture contributes to the group mission of economic acceleration through technology.',
      industry: Industry.TELECOM,
      isFeatured: false,
      displayOrder: 5,
    },
    {
      id: 'system-fisheries-limited',
      name: 'System Fisheries Limited',
      slug: 'system-fisheries-limited',
      shortDescription: 'Environmentally-conscious fish farming committed to agricultural advancement and community empowerment.',
      description: 'System Fisheries Limited was established as System Group commitment to sustainability, promoting environmentally-friendly fish farming practices. This venture contributes to agricultural advancement and supports local communities by creating jobs and driving economic growth.',
      industry: Industry.AGRICULTURE,
      isFeatured: false,
      displayOrder: 6,
    },
    {
      id: 'royal-barber',
      name: 'Royal Barber',
      slug: 'royal-barber',
      shortDescription: "Premium men's grooming salon delivering a luxurious experience in the heart of Chattogram.",
      description: "Royal Barber is System Group's elegant men's salon in Chattogram. Offering expert stylists, premium treatments, and a luxurious ambiance, the salon provides precision haircuts, rejuvenating massages, and meticulous beard trims in an atmosphere designed for discerning clients.",
      industry: Industry.GROOMING,
      isFeatured: false,
      displayOrder: 7,
    },
  ]

  for (const concern of concerns) {
    await prisma.sisterConcern.upsert({
      where: { slug: concern.slug },
      update: concern,
      create: { isPublished: true, ...concern },
    })
  }
  console.log('Sister concerns seeded')

  // ── PROJECTS ────────────────────────────────────────────────
  const projects = [
    {
      id: 'system-imperial-complex',
      name: 'System Imperial Complex',
      slug: 'system-imperial-complex',
      description: "The System Imperial Complex inaugurated in November 2023 with a $3 million investment, stands as Chattogram's premier marketplace for IT, electronics, and mobile products. The complex houses brand shops for Samsung, MI, Oppo, Vivo, Infinix, Techno and various accessories retailers across six floors.",
      location: '153 Kapasgola Road, Chawkbazar, Chattogram',
      status: ProjectStatus.COMPLETED,
      investment: '$3 million',
      completionYear: 2023,
      isFeatured: true,
      displayOrder: 1,
      sisterConcernId: 'system-builders-limited',
    },
    {
      id: 'system-aziz-complex',
      name: 'System Aziz Complex',
      slug: 'system-aziz-complex',
      description: 'Aziz Complex is a groundbreaking project unfolding in 2024 with a $4 million investment in Rajakhali, Chattogram. This unique development combines a trendy shopping mall on the first four floors with luxurious apartments above, reaching up to the 12th floor.',
      location: 'Rajakhali, Chattogram',
      status: ProjectStatus.ONGOING,
      investment: '$4 million',
      completionYear: 2024,
      isFeatured: true,
      displayOrder: 2,
      sisterConcernId: 'system-builders-limited',
    },
    {
      id: 'system-dove-tower',
      name: 'System Dove Tower',
      slug: 'system-dove-tower',
      description: 'System Dove Tower is a premium residential development in Chattogram, opened December 2023 with a $1 million investment. Beyond bricks and mortar, it symbolises a commitment to elevating urban living standards and contributing to the dynamic urban development of Chattogram.',
      location: 'Chattogram',
      status: ProjectStatus.COMPLETED,
      investment: '$1 million',
      completionYear: 2023,
      isFeatured: false,
      displayOrder: 3,
      sisterConcernId: 'system-properties-limited',
    },
    {
      id: 'system-sattar-tower',
      name: 'System Sattar Tower',
      slug: 'system-sattar-tower',
      description: "System Group's debut project, later rebranded as Portland Sattar Tower, quickly became a symbol of excellence and established System Group as a rising force in Bangladesh's real estate market. This pioneering development set the standard for quality and innovation that defines all System Group properties.",
      location: 'Chattogram',
      status: ProjectStatus.COMPLETED,
      investment: null,
      completionYear: 2009,
      isFeatured: false,
      displayOrder: 4,
      sisterConcernId: 'system-properties-limited',
    },
    {
      id: 'system-chakaria-complex',
      name: 'System Chakaria Complex',
      slug: 'system-chakaria-complex',
      description: 'System Chakaria Complex is a landmark commercial development by System Properties Limited, delivering premium commercial space in Chakaria. The project underscores System Group commitment to regional development beyond Chattogram city.',
      location: 'Chakaria, Chattogram',
      status: ProjectStatus.COMPLETED,
      investment: null,
      completionYear: null,
      isFeatured: false,
      displayOrder: 5,
      sisterConcernId: 'system-properties-limited',
    },
    {
      id: 'system-hill-park',
      name: 'System Hill Park',
      slug: 'system-hill-park',
      description: "System Hill Park is a distinctive residential development by System Builders Limited, taking advantage of Chattogram's unique topography to offer elevated living with panoramic views.",
      location: 'Chattogram',
      status: ProjectStatus.AVAILABLE,
      investment: null,
      completionYear: null,
      isFeatured: false,
      displayOrder: 6,
      sisterConcernId: 'system-builders-limited',
    },
    {
      id: 'system-si-park',
      name: 'System SI Park',
      slug: 'system-si-park',
      description: 'System SI Park is a modern mixed-use development by System Builders Limited, designed as a self-contained commercial and residential ecosystem.',
      location: 'Chattogram',
      status: ProjectStatus.AVAILABLE,
      investment: null,
      completionYear: null,
      isFeatured: false,
      displayOrder: 7,
      sisterConcernId: 'system-builders-limited',
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: { isPublished: true, ...project },
    })
  }
  console.log('Projects seeded')

  // ── OUTLETS ─────────────────────────────────────────────────
  await prisma.outlet.upsert({
    where: { id: 'hq-chattogram' },
    update: {},
    create: {
      id: 'hq-chattogram',
      name: 'System Group Headquarters',
      type: 'office',
      address: 'System Imperial Complex (6th Floor), 153 Kapasgola Road, Chawkbazar',
      city: 'Chattogram',
      openingHours: '10:01 AM - 08:00 PM, Saturday-Thursday',
      isActive: true,
      sisterConcernId: 'system-builders-limited',
    },
  })
  console.log('Outlets seeded')

  // ── SITE SETTINGS ────────────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'System Group Bangladesh' },
    { key: 'tagline', value: 'Xplore beyond!' },
    { key: 'established', value: '2009' },
    { key: 'stat_projects', value: '6+' },
    { key: 'stat_employees', value: '80+' },
    { key: 'stat_investment', value: 'Multi-Million USD' },
    { key: 'stat_asset_base', value: 'BDT 190+ Crore' },
    { key: 'address', value: 'System Imperial Complex (6th Floor), 153 Kapasgola Road, Chawkbazar, Chattogram 4203, Bangladesh' },
    { key: 'phone', value: '' },
    { key: 'email', value: '' },
    { key: 'office_hours', value: '10:01 AM - 08:00 PM, Saturday-Thursday' },
    { key: 'facebook_url', value: '' },
    { key: 'linkedin_url', value: '' },
    { key: 'seo_title', value: 'System Group Bangladesh - Xplore Beyond!' },
    { key: 'seo_description', value: 'System Group Bangladesh is a diversified business group established in 2009, operating across real estate, construction, ICT, telecommunications, trading, lifestyle, agriculture, and grooming.' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log('Settings seeded')
  console.log('\nDone. Change the admin password before going live.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
