

import { Job, TranslationDictionary, Application, User, UserRole, Report, Review, BlogPost, ChatMessage, CommunityPost, InterviewSession, SystemAnnouncement, Event } from './types';

// Minimal valid PDF (Blank page with "Mock Resume" text approximation)
export const MOCK_PDF_BASE64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgNTk1LjI4IDg0MS44OSBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1N5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCGMgICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDcwIFRECi9GMSAyNCBUZgoKKE1vY2sgUmVzdW1lIERvd25sb2FkKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTU3IDAwMDAwIG4gCjAwMDAwMDAyNjYgMDAwMDAgbiAKMDAwMDAwMDM1MyAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NDgKJSVFT0YK";

export const CITIES = [
  'Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar', 'Jalalabad', 'Kunduz', 'Ghazni', 'Bamyan', 'Khost', 'Faryab', 'Badakhshan', 'Helmand'
];

export const CATEGORIES = [
  'Technology', 'Engineering', 'Healthcare', 'Education', 'Finance', 'Management', 'Sales', 'NGO', 'Logistics', 'Security', 'Legal', 'Admin', 'Telecommunications', 'Aviation', 'Construction'
];

export const INDUSTRIES = [
  'Technology', 'Telecommunications', 'Banking', 'Aviation', 'Construction', 'Healthcare', 'Education', 'Logistics', 'NGO', 'Retail'
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post1',
    authorId: 'emp1',
    authorName: 'Tech Solutions Afghan',
    authorAvatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff',
    authorRole: UserRole.EMPLOYER,
    content: "We are excited to announce our new partnership with Microsoft! This will open up 50+ new jobs in Kabul for Cloud Engineers. Stay tuned!",
    likes: ['seeker1', 'user2'],
    comments: [
        { id: 'c1', authorId: 'seeker1', authorName: 'Ahmad Wali', content: 'This is amazing news! Congratulations.', timestamp: '2023-11-15T10:30:00Z' }
    ],
    timestamp: '2023-11-15T09:00:00Z'
  },
  {
    id: 'post2',
    authorId: 'seeker1',
    authorName: 'Ahmad Wali',
    authorAvatar: 'https://ui-avatars.com/api/?name=Ahmad+Wali&background=random',
    authorRole: UserRole.SEEKER,
    content: "Just finished the 'Advanced React' skill assessment on Afghan Job Finder. Highly recommend it to test your skills!",
    likes: ['emp1'],
    comments: [],
    timestamp: '2023-11-14T14:20:00Z'
  }
];

export const MOCK_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'ann1',
    title: 'Platform Maintenance',
    message: 'We will be undergoing scheduled maintenance on Friday at 2:00 AM. The site will be unavailable for approximately 1 hour.',
    type: 'Warning',
    targetAudience: 'All',
    createdAt: '2023-11-20',
    isActive: true
  },
  {
    id: 'ann2',
    title: 'New AI Features',
    message: 'Employers can now use AI to generate interview questions! Check it out in your dashboard.',
    type: 'Info',
    targetAudience: 'Employers',
    createdAt: '2023-11-18',
    isActive: true
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt1',
    title: 'Kabul Tech Job Fair 2024',
    organizer: 'Afghan Job Finder',
    date: '2024-02-15',
    time: '09:00 AM - 04:00 PM',
    type: 'In-Person',
    location: 'Kabul Serena Hotel, Kabul',
    description: 'Meet top tech employers, attend workshops, and network with industry leaders. Bring your CV!',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    attendees: 1240,
    category: 'Job Fair'
  },
  {
    id: 'evt2',
    title: 'Mastering Remote Work',
    organizer: 'Tech Solutions Afghan',
    date: '2024-01-20',
    time: '02:00 PM - 03:30 PM',
    type: 'Online',
    location: 'Zoom Webinar',
    description: 'Learn best practices for working remotely for international clients. Essential skills, tools, and communication tips.',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    attendees: 450,
    category: 'Webinar'
  },
  {
    id: 'evt3',
    title: 'Women in Business Summit',
    organizer: 'Women Chamber of Commerce',
    date: '2024-03-08',
    time: '10:00 AM - 02:00 PM',
    type: 'In-Person',
    location: 'Intercontinental Hotel, Kabul',
    description: 'Celebrating women entrepreneurs and leaders. Networking, panels, and mentorship opportunities.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    attendees: 300,
    category: 'Networking'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Top 10 In-Demand Skills in Afghanistan for 2024",
    excerpt: "Discover the skills that employers in Kabul and beyond are desperately looking for this year. From IT to Project Management, here is what you need to know.",
    content: `
      <p>The job market in Afghanistan is evolving rapidly. As technology integration increases and international organizations continue their operations, the demand for specific skill sets has shifted.</p>
      
      <h3 class="text-xl font-bold mt-4 mb-2">1. Information Technology (IT)</h3>
      <p>With digital transformation occurring in banks, telecom, and government sectors, IT skills like Network Administration, Software Development (React, Node.js), and Cybersecurity are at the top of the list.</p>

      <h3 class="text-xl font-bold mt-4 mb-2">2. Project Management</h3>
      <p>NGOs and construction firms are constantly seeking professionals who can manage resources, timelines, and budgets effectively. Certifications like PMP are highly valued.</p>

      <h3 class="text-xl font-bold mt-4 mb-2">3. English Language Proficiency</h3>
      <p>Communication remains key. Advanced English skills open doors to international organizations and higher-paying roles.</p>
      
      <p class="mt-4">Investing in these skills can significantly boost your employability in the current market.</p>
    `,
    date: "Oct 25, 2023",
    author: "Tech Solutions Afghan",
    authorId: "emp1", // Linked to Tech Solutions
    role: "Employer",
    image: "https://picsum.photos/id/1/800/400",
    category: "Market Trends",
    readTime: "5 min read",
    status: 'Published'
  },
  {
    id: 2,
    title: "How to Write a CV That Gets You Hired",
    excerpt: "Expert tips on crafting a resume that stands out to Afghan NGOs and private companies. Avoid common mistakes and highlight your true potential.",
    content: `
      <p>Your CV is your first impression. In a competitive market like Afghanistan, a generic CV won't cut it. Here is how to make yours stand out.</p>

      <h3 class="text-xl font-bold mt-4 mb-2">Tailor Your CV</h3>
      <p>Don't send the same CV for every job. Read the job description and include keywords that match the requirements.</p>

      <h3 class="text-xl font-bold mt-4 mb-2">Focus on Achievements</h3>
      <p>Instead of just listing duties, list what you achieved. Did you increase sales? Did you train a team? Use numbers to quantify your success.</p>

      <h3 class="text-xl font-bold mt-4 mb-2">Keep it Concise</h3>
      <p>Recruiters spend about 6 seconds scanning a resume. Keep it to 2 pages maximum and use bullet points for readability.</p>
    `,
    date: "Oct 20, 2023",
    author: "Sarah Khan",
    role: "HR Specialist",
    image: "https://picsum.photos/id/20/800/400",
    category: "Resume Tips",
    readTime: "4 min read",
    status: 'Published'
  },
  {
    id: 3,
    title: "Remote Work Opportunities: A Growing Trend",
    excerpt: "Explore how Afghan professionals are finding success working for international clients from home. Learn about platforms and payment methods.",
    content: `
      <p>The global shift to remote work has opened new doors for Afghan talent. You no longer need to leave the country to work for international companies.</p>
      
      <h3 class="text-xl font-bold mt-4 mb-2">Finding Remote Jobs</h3>
      <p>Platforms like Upwork, Freelancer, and specialized remote job boards are great places to start. Look for roles in writing, translation, graphic design, and coding.</p>

      <h3 class="text-xl font-bold mt-4 mb-2">Overcoming Challenges</h3>
      <p>Internet stability and electricity can be issues. Investing in a backup power source and a reliable 4G connection is essential for a remote career.</p>
    `,
    date: "Oct 15, 2023",
    author: "Roshan Telecom",
    authorId: "emp2", // Linked to Roshan
    role: "Employer",
    image: "https://picsum.photos/id/3/800/400",
    category: "Remote Work",
    readTime: "6 min read",
    status: 'Published'
  },
  {
    id: 4,
    title: "Acing the Interview: Behavioral Questions",
    excerpt: "Behavioral questions are tough. Learn the STAR method to answer questions like 'Tell me about a time you failed' with confidence.",
    content: `
       <p>Behavioral interview questions ask you to describe how you acted in a past situation. Employers use them to predict your future performance.</p>
       
       <h3 class="text-xl font-bold mt-4 mb-2">The STAR Method</h3>
       <ul class="list-disc pl-5 space-y-2">
         <li><strong>S - Situation:</strong> Set the scene and give the necessary details of your example.</li>
         <li><strong>T - Task:</strong> Describe what your responsibility was in that situation.</li>
         <li><strong>A - Action:</strong> Explain exactly what steps you took to address it.</li>
         <li><strong>R - Result:</strong> Share what outcomes your actions achieved.</li>
       </ul>
       
       <p class="mt-4">Practice this structure, and you will be ready for almost any behavioral question.</p>
    `,
    date: "Nov 01, 2023",
    author: "Tech Solutions Afghan",
    authorId: "emp1", // Linked to Tech Solutions
    role: "Employer",
    image: "https://picsum.photos/id/6/800/400",
    category: "Interview Prep",
    readTime: "7 min read",
    status: 'Published'
  }
];

// Helper to generate mock users (employers)
const generateEmployers = () => {
  const companies = [
    { name: 'Afghan Wireless', ind: 'Telecommunications', loc: 'Kabul' },
    { name: 'Etisalat Afghanistan', ind: 'Telecommunications', loc: 'Kabul' },
    { name: 'MTN Afghanistan', ind: 'Telecommunications', loc: 'Kabul' },
    { name: 'Salaam Telecom', ind: 'Telecommunications', loc: 'Kabul' },
    { name: 'Afghanistan International Bank', ind: 'Banking', loc: 'Kabul' },
    { name: 'Ghazanfar Bank', ind: 'Banking', loc: 'Mazar-i-Sharif' },
    { name: 'First MicroFinance Bank', ind: 'Banking', loc: 'Kabul' },
    { name: 'Afghan United Bank', ind: 'Banking', loc: 'Kabul' },
    { name: 'Bakhtar Bank', ind: 'Banking', loc: 'Kabul' },
    { name: 'Pashtany Bank', ind: 'Banking', loc: 'Kabul' },
    { name: 'Netlinks', ind: 'Technology', loc: 'Kabul' },
    { name: 'Grand Technology Resources', ind: 'Technology', loc: 'Kabul' },
    { name: 'Paywast', ind: 'Technology', loc: 'Kabul' },
    { name: 'Rana Technologies', ind: 'Technology', loc: 'Kabul' },
    { name: 'IO Global', ind: 'Technology', loc: 'Herat' },
    { name: 'DABS', ind: 'Energy', loc: 'Kabul' },
    { name: 'Kabul University', ind: 'Education', loc: 'Kabul' },
    { name: 'Kardan University', ind: 'Education', loc: 'Kabul' },
    { name: 'AUAF', ind: 'Education', loc: 'Kabul' },
    { name: 'Kateb University', ind: 'Education', loc: 'Kabul' },
    { name: 'Bakhtar University', ind: 'Education', loc: 'Kabul' },
    { name: 'FMIC Hospital', ind: 'Healthcare', loc: 'Kabul' },
    { name: 'City Medical Complex', ind: 'Healthcare', loc: 'Kabul' },
    { name: 'Royal Medical Complex', ind: 'Healthcare', loc: 'Herat' },
    { name: 'Wazir Akbar Khan Hospital', ind: 'Healthcare', loc: 'Kabul' },
    { name: 'Tolo TV', ind: 'Media', loc: 'Kabul' },
    { name: 'Moby Group', ind: 'Media', loc: 'Kabul' },
    { name: 'Ariana TV', ind: 'Media', loc: 'Kabul' },
    { name: 'Shamshad TV', ind: 'Media', loc: 'Kabul' },
    { name: '1TV', ind: 'Media', loc: 'Kabul' },
    { name: 'Safi Airways', ind: 'Aviation', loc: 'Kabul' },
    { name: 'Ariana Afghan Airlines', ind: 'Aviation', loc: 'Kabul' },
    { name: 'Kam Air', ind: 'Aviation', loc: 'Kabul' },
    { name: 'Pamir Airways', ind: 'Aviation', loc: 'Kabul' },
    { name: 'Alokozay Group', ind: 'Manufacturing', loc: 'Kabul' },
    { name: 'Afghan Jet International', ind: 'Aviation', loc: 'Kabul' },
    { name: 'Habib Gulzar Motors', ind: 'Retail', loc: 'Kabul' },
    { name: 'Toyota Afghanistan', ind: 'Retail', loc: 'Kabul' },
    { name: 'Nassib Group', ind: 'Construction', loc: 'Kabul' },
    { name: 'Vatan Group', ind: 'Logistics', loc: 'Kandahar' },
    { name: 'Supreme Group', ind: 'Logistics', loc: 'Kabul' },
    { name: 'ACBAR', ind: 'NGO', loc: 'Kabul' },
    { name: 'Save the Children', ind: 'NGO', loc: 'Kabul' },
    { name: 'NRC', ind: 'NGO', loc: 'Jalalabad' },
    { name: 'DRC', ind: 'NGO', loc: 'Herat' },
    { name: 'CARE Afghanistan', ind: 'NGO', loc: 'Kabul' },
    { name: 'World Vision', ind: 'NGO', loc: 'Herat' },
    { name: 'Aga Khan Foundation', ind: 'NGO', loc: 'Bamyan' },
    { name: 'UNAMA', ind: 'NGO', loc: 'Kabul' },
    { name: 'UNICEF Afghanistan', ind: 'NGO', loc: 'Kabul' }
  ];

  return companies.map((c, i) => ({
    id: `emp_gen_${i}`,
    name: c.name,
    email: `contact@${c.name.toLowerCase().replace(/\s/g, '')}.af`,
    role: UserRole.EMPLOYER,
    avatar: `https://ui-avatars.com/api/?name=${c.name.replace(/\s/g, '+')}&background=random&color=fff`,
    status: 'Active',
    plan: i % 5 === 0 ? 'Premium' : i % 3 === 0 ? 'Standard' : 'Free',
    industry: c.ind,
    bio: `${c.name} is a leading organization in the ${c.ind} sector, committed to excellence and growth in Afghanistan.`,
    website: `https://${c.name.toLowerCase().replace(/\s/g, '')}.af`,
    address: `${c.loc}, Afghanistan`,
    socialLinks: {
        linkedin: `https://linkedin.com/company/${c.name.toLowerCase().replace(/\s/g, '')}`,
        facebook: `https://facebook.com/${c.name.toLowerCase().replace(/\s/g, '')}`
    },
    gallery: [
        `https://picsum.photos/id/${i+10}/400/300`,
        `https://picsum.photos/id/${i+20}/400/300`,
        `https://picsum.photos/id/${i+30}/400/300`
    ]
  } as User));
};

const generatedEmployers = generateEmployers();

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Super Admin',
    email: 'admin@afghanjobfinder.com',
    role: UserRole.ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=red&color=fff',
    status: 'Active',
    plan: 'Premium'
  },
  {
    id: 'emp1',
    name: 'Tech Solutions Afghan',
    email: 'hr@techsolutions.af',
    role: UserRole.EMPLOYER,
    avatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff',
    status: 'Active',
    plan: 'Premium',
    industry: 'Technology',
    bio: 'Leading tech company in Kabul providing software solutions.',
    website: 'https://techsolutions.af',
    address: 'Kabul, Afghanistan',
    socialLinks: {
        linkedin: "https://linkedin.com/company/techsolutions-af",
        twitter: "https://twitter.com/techsolutions"
    },
    gallery: [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 'emp2',
    name: 'Roshan Telecom',
    email: 'hr@roshan.af',
    role: UserRole.EMPLOYER,
    avatar: 'https://ui-avatars.com/api/?name=Roshan&background=e60000&color=fff',
    status: 'Active',
    plan: 'Premium',
    industry: 'Telecommunications',
    bio: 'Roshan is the leading total communications provider in Afghanistan, covering all 34 provinces.',
    website: 'https://roshan.af',
    address: 'Kabul, Afghanistan',
    socialLinks: {
        linkedin: "https://linkedin.com/company/roshan",
        facebook: "https://facebook.com/roshanconnects"
    },
    gallery: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    id: 'emp3',
    name: 'Kam Air',
    email: 'jobs@kamair.com',
    role: UserRole.EMPLOYER,
    avatar: 'https://ui-avatars.com/api/?name=Kam+Air&background=ff6600&color=fff',
    status: 'Active',
    plan: 'Standard',
    industry: 'Aviation',
    bio: 'Afghanistan’s first private commercial airline.',
    website: 'https://kamair.com',
    address: 'Kabul Intl Airport'
  },
  {
    id: 'emp4',
    name: 'Azizi Bank',
    email: 'hr@azizibank.af',
    role: UserRole.EMPLOYER,
    avatar: 'https://ui-avatars.com/api/?name=Azizi+Bank&background=003366&color=fff',
    status: 'Pending',
    plan: 'Free',
    industry: 'Finance',
    bio: 'One of the largest commercial banks in Afghanistan.',
    website: 'https://azizibank.af',
    address: 'Zanbaq Square, Kabul'
  },
  {
    id: 'seeker1',
    name: 'Ahmad Wali',
    email: 'ahmad@example.com',
    role: UserRole.SEEKER,
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Wali&background=random',
    status: 'Active',
    plan: 'Free',
    jobTitle: 'Frontend Developer',
    bio: 'Experienced React developer with 3 years of experience in building responsive web applications. Passionate about clean code and user experience.',
    address: 'Herat, Afghanistan',
    phone: '+93 700 123 456',
    resume: 'ahmad_resume.pdf',
    resumeData: MOCK_PDF_BASE64, // Added valid resume data for download
    following: ['emp1', 'emp2'],
    documents: [
        {
            id: 'doc1',
            name: 'ahmad_resume_tech.pdf',
            type: 'Resume',
            data: MOCK_PDF_BASE64,
            date: '2023-10-15',
            size: '240 KB'
        },
        {
            id: 'doc2',
            name: 'react_certificate.pdf',
            type: 'Certificate',
            data: MOCK_PDF_BASE64,
            date: '2023-09-01',
            size: '1.2 MB'
        }
    ],
    experience: [
      {
        id: 'exp1',
        title: 'Frontend Developer',
        company: 'Tech Solutions Afghan',
        startDate: 'Jan 2021',
        endDate: 'Present',
        description: 'Developing responsive web applications using React and Tailwind CSS. Improving site performance by 30%.'
      },
      {
        id: 'exp2',
        title: 'Junior Web Developer',
        company: 'Afghan IT',
        startDate: 'Jun 2019',
        endDate: 'Dec 2020',
        description: 'Assisted in building client websites using WordPress and HTML/CSS. Maintained legacy codebases.'
      }
    ],
    education: [
      {
        id: 'edu1',
        degree: 'Bachelor of Computer Science',
        school: 'Kabul University',
        startDate: '2015',
        endDate: '2019'
      }
    ],
    verifiedSkills: ['React', 'JavaScript', 'HTML5']
  },
  ...generatedEmployers
];

// Generate jobs for the generated employers
const generateJobs = () => {
  const roles = [
    { title: 'Administrative Assistant', cat: 'Admin' },
    { title: 'Project Manager', cat: 'Management' },
    { title: 'IT Officer', cat: 'Technology' },
    { title: 'Finance Officer', cat: 'Finance' },
    { title: 'Security Guard', cat: 'Security' },
    { title: 'Driver', cat: 'Logistics' },
    { title: 'Cleaner', cat: 'Admin' },
    { title: 'Sales Executive', cat: 'Sales' },
    { title: 'Software Engineer', cat: 'Technology' },
    { title: 'HR Manager', cat: 'Management' },
    { title: 'Nurse', cat: 'Healthcare' },
    { title: 'Teacher', cat: 'Education' },
    { title: 'Civil Engineer', cat: 'Engineering' },
    { title: 'Logistics Coordinator', cat: 'Logistics' },
    { title: 'Customer Service', cat: 'Admin' }
  ];

  const jobs: Job[] = [];
  
  generatedEmployers.forEach((emp, i) => {
    // Each employer gets 1-3 jobs
    const numJobs = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numJobs; j++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      jobs.push({
        id: `job_gen_${i}_${j}`,
        employerId: emp.id, // Linked to generated employer
        title: role.title,
        company: emp.name,
        companyLogo: emp.avatar,
        location: emp.address?.split(',')[0] || 'Kabul',
        salaryMin: 15000 + Math.floor(Math.random() * 40000),
        salaryMax: 60000 + Math.floor(Math.random() * 50000),
        currency: 'AFN',
        type: ['Full-time', 'Part-time', 'Contract'][Math.floor(Math.random() * 3)] as any,
        experienceLevel: ['Entry', 'Mid', 'Senior'][Math.floor(Math.random() * 3)] as any,
        category: role.cat,
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        deadline: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        description: `We are looking for a ${role.title} to join our team at ${emp.name}. The ideal candidate will have strong communication skills and relevant experience in the ${role.cat} field.`,
        requirements: ['Bachelor Degree', '2+ Years Experience', 'Communication Skills', 'Computer Literacy'],
        responsibilities: ['Daily reporting', 'Team coordination', 'Task management'],
        isFeatured: Math.random() > 0.8,
        status: 'Active'
      });
    }
  });
  return jobs;
};

const generatedJobs = generateJobs();

export const MOCK_JOBS: Job[] = [
  {
    id: 'job1',
    employerId: 'emp1',
    title: 'Senior React Developer',
    company: 'Tech Solutions Afghan',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff',
    location: 'Kabul',
    salaryMin: 50000,
    salaryMax: 80000,
    currency: 'AFN',
    type: 'Full-time',
    experienceLevel: 'Senior',
    category: 'Technology',
    postedDate: '2023-10-25',
    deadline: '2023-11-25',
    description: 'We are looking for an experienced React Developer to join our team. You will be responsible for building user interfaces for our web applications.',
    requirements: ['3+ years React', 'TypeScript', 'Tailwind CSS'],
    responsibilities: ['Develop features', 'Code review', 'Mentor juniors'],
    isFeatured: true,
    status: 'Active'
  },
  {
    id: 'job2',
    employerId: 'emp1',
    title: 'Project Manager',
    company: 'Tech Solutions Afghan',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff',
    location: 'Kabul',
    salaryMin: 60000,
    salaryMax: 90000,
    currency: 'AFN',
    type: 'Full-time',
    experienceLevel: 'Mid',
    category: 'Management',
    postedDate: '2023-10-28',
    deadline: '2023-11-28',
    description: 'Looking for a PM to lead software projects.',
    requirements: ['Agile', 'Scrum', 'Leadership'],
    responsibilities: ['Manage sprint', 'Client communication'],
    isFeatured: false,
    status: 'Active'
  },
  {
    id: 'job3',
    employerId: 'emp2',
    title: 'Network Engineer',
    company: 'Roshan Telecom',
    companyLogo: 'https://ui-avatars.com/api/?name=Roshan&background=e60000&color=fff',
    location: 'Kandahar',
    salaryMin: 40000,
    salaryMax: 65000,
    currency: 'AFN',
    type: 'Full-time',
    experienceLevel: 'Mid',
    category: 'Telecommunications',
    postedDate: '2023-11-01',
    deadline: '2023-12-01',
    description: 'Responsible for maintaining network infrastructure in the southern region.',
    requirements: ['CCNA/CCNP', '3 Years Experience', 'Hardware Troubleshooting'],
    responsibilities: ['Monitor network performance', 'Troubleshoot connectivity issues'],
    isFeatured: true,
    status: 'Active'
  },
  ...generatedJobs
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app1',
    jobId: 'job1',
    seekerId: 'seeker1',
    resumeUrl: 'ahmad_resume.pdf',
    resumeData: MOCK_PDF_BASE64, // Also added here for consistency
    coverLetter: 'I am very interested in this role and have the required skills.',
    status: 'Applied',
    date: '2023-10-26',
    timeline: [
        { status: 'Applied', date: '2023-10-26', note: 'Application submitted' }
    ]
  },
  {
    id: 'app2',
    jobId: 'job3',
    seekerId: 'seeker1',
    resumeUrl: 'ahmad_resume.pdf',
    resumeData: MOCK_PDF_BASE64,
    coverLetter: 'Network engineering is my passion.',
    status: 'Interview',
    date: '2023-11-05',
    interviewDate: new Date().toISOString().split('T')[0], // Today for demo
    interviewTime: '10:00 AM',
    interviewMessage: 'Lets discuss your CCNA cert.',
    timeline: [
        { status: 'Applied', date: '2023-11-05', note: 'Application submitted' },
        { status: 'Interview', date: '2023-11-07', note: 'Interview scheduled' }
    ]
  }
];

export const MOCK_REPORTS: Report[] = [];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev1',
    companyId: 'emp1',
    userId: 'seeker1',
    userName: 'Ahmad Wali',
    rating: 5,
    comment: 'Great work environment and supportive management.',
    date: '2023-11-10'
  },
  {
    id: 'rev2',
    companyId: 'emp1',
    userId: 'user2',
    userName: 'Sarah Khan',
    rating: 4,
    comment: 'Good salary but long hours.',
    date: '2023-10-15'
  }
];

export const MOCK_INTERVIEW_SESSIONS: InterviewSession[] = [
  {
    id: 'sess1',
    userId: 'seeker1',
    jobTitle: 'Frontend Developer',
    companyName: 'Tech Solutions Afghan',
    date: '2023-11-10',
    score: 85,
    transcript: [
      {
        question: 'Tell me about yourself.',
        answer: 'I am a frontend developer with 3 years of experience in React.',
        feedback: 'Good start, but try to include more specific achievements.'
      },
      {
        question: 'Why do you want to work here?',
        answer: 'I like your company culture and the projects you work on.',
        feedback: 'Excellent. Shows you did your research.'
      }
    ]
  }
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'emp1',
    receiverId: 'seeker1',
    content: 'Hello Ahmad, thanks for applying. Are you available for a quick call tomorrow?',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false
  },
  {
    id: 'msg2',
    senderId: 'seeker1',
    receiverId: 'emp1',
    content: 'Hi, yes I am available after 2 PM.',
    timestamp: new Date(Date.now() - 80000000).toISOString(),
    isRead: true
  }
];

export const TRANSLATIONS: TranslationDictionary = {
  // ... (Keep existing translations as they are, just ensuring the file is valid)
  home: { en: 'Home', fa: 'خانه', ps: 'کور' },
  jobs: { en: 'Find Jobs', fa: 'جستجوی وظایف', ps: 'دندې لټون' },
  companies: { en: 'Companies', fa: 'شرکت‌ها', ps: 'شرکتونه' },
  login: { en: 'Login', fa: 'ورود', ps: 'ننوتل' },
  register: { en: 'Register', fa: 'ثبت نام', ps: 'راپور' },
  dashboard: { en: 'Dashboard', fa: 'داشبورد کارجو', ps: 'ډشبورډ' },
  logout: { en: 'Logout', fa: 'خروج', ps: 'وتل' },
  blog: { en: 'Career Advice', fa: 'مشاوره شغلی', ps: 'د کار مشوره' },
  about: { en: 'About Us', fa: 'درباره ما', ps: 'زموږ په اړه' },
  community: { en: 'Community', fa: 'جامعه', ps: 'ټولنه' },
  
  // Hero
  heroTitle: { 
    en: 'Find Your Dream Job in Afghanistan', 
    fa: 'شغل رویایی خود را در افغانستان پیدا کنید', 
    ps: 'په افغانستان کې خپله د خوښې دنده ومومئ' 
  },
  heroSubtitle: {
    en: 'Connecting talent with opportunity. The most trusted job portal.',
    fa: 'اتصال استعدادها با فرصت‌ها. معتبرترین پورتال کاریابی.',
    ps: 'د فرصتونو سره د وړتیا نښلول. د کار موندنې ترټولو باوري پورټل.'
  },
  searchPlaceholder: { en: 'Job title, keywords...', fa: 'عنوان وظیفه، کلمات کلیدی...', ps: 'د دندې سرلیک، کلیدي ټکي...' },
  locationPlaceholder: { en: 'City or Province', fa: 'شهر یا ولایت', ps: 'ښار یا ولایت' },
  searchButton: { en: 'Search', fa: 'جستجو', ps: 'لټون' },

  // Filters
  filterBy: { en: 'Filter By', fa: 'فیلتر بر اساس', ps: 'فلټر په واسطه' },
  fullTime: { en: 'Full-time', fa: 'تمام وقت', ps: 'بشپړ وخت' },
  partTime: { en: 'Part-time', fa: 'پاره وقت', ps: 'نیمه وخت' },
  remote: { en: 'Remote', fa: 'از راه دور', ps: 'لیرې' },
  contract: { en: 'Contract', fa: 'قراردادی', ps: 'قراردادي' },
  any: { en: 'Any', fa: 'همه', ps: 'هر یو' },
  clearFilters: { en: 'Clear Filters', fa: 'پاک کردن فیلترها', ps: 'فلټرونه پاک کړئ' },
  salaryRange: { en: 'Salary Range', fa: 'محدوده معاش', ps: 'د معاش حد' },
  min: { en: 'Min', fa: 'حداقل', ps: 'لږترلږه' },
  max: { en: 'Max', fa: 'حداکثر', ps: 'اعظمي' },
  sortBy: { en: 'Sort By', fa: 'مرتب سازی', ps: 'لخوا ترتیب' },
  newest: { en: 'Newest', fa: 'جدیدترین', ps: 'نوی' },
  oldest: { en: 'Oldest', fa: 'قدیمی‌ترین', ps: 'زوړ' },
  salaryHighLow: { en: 'Salary: High to Low', fa: 'معاش: زیاد به کم', ps: 'معاش: لوړ نه ټیټ' },
  salaryLowHigh: { en: 'Salary: Low to High', fa: 'معاش: کم به زیاد', ps: 'معاش: ټیټ نه لوړ' },
  showFilters: { en: 'Show Filters', fa: 'نمایش فیلترها', ps: 'فلټرونه ښکاره کړئ' },
  hideFilters: { en: 'Hide Filters', fa: 'پنهان کردن فیلترها', ps: 'فلټرونه پټ کړئ' },
  
  // Job Card
  applyNow: { en: 'Apply Now', fa: 'درخواست دهید', ps: 'همدا اوس غوښتنه وکړئ' },
  details: { en: 'View Details', fa: 'جزئیات', ps: 'جزئیات' },
  posted: { en: 'Posted', fa: 'منتشر شده', ps: 'خپور شوی' },
  
  // Employer
  postJob: { en: 'Post a Job', fa: 'ارسال وظیفه', ps: 'دنده اعلان کړئ' },
  aiHelp: { en: 'Generate with AI', fa: 'تولید با هوش مصنوعی', ps: 'د AI سره تولید کړئ' },
  employerDashboard: { en: 'Employer Dashboard', fa: 'داشبورد کارفرما', ps: 'د کارګمارونکي ډشبورډ' },
  activeJobs: { en: 'Active Jobs', fa: 'وظایف فعال', ps: 'فعاله دندې' },
  totalApplications: { en: 'Total Applications', fa: 'مجموع درخواست‌ها', ps: 'ټول غوښتنلیکونه' },
  viewsThisWeek: { en: 'Views this week', fa: 'بازدیدهای این هفته', ps: 'په دې اونۍ کې لیدنې' },
  jobTitle: { en: 'Job Title', fa: 'عنوان وظیفه', ps: 'د دندې سرلیک' },
  requiredSkills: { en: 'Required Skills', fa: 'مهارت‌های مورد نیاز', ps: 'اړین مهارتونه' },
  generating: { en: 'Generating...', fa: 'در حال تولید...', ps: 'د تولید په حال کې...' },
  
  // Seeker
  seekerDashboard: { en: 'Seeker Dashboard', fa: 'داشبورد کارجو', ps: 'د کار لټوونکي ډشبورډ' },
  myApplications: { en: 'My Applications', fa: 'درخواست‌های من', ps: 'زما غوښتنلیکونه' },
  savedJobs: { en: 'Saved Jobs', fa: 'وظایف ذخیره شده', ps: 'زیرمه شوي دندې' },
  aiResume: { en: 'AI Resume Assistant', fa: 'دستیار رزومه هوش مصنوعی', ps: 'د AI ریزیوم مرستیال' },
  aiExp: { en: 'AI Experience Enhancer', fa: 'بهبود دهنده تجربه (AI)', ps: 'د تجربې لوړونکی (AI)' },
  improveSummary: { en: 'Improve Summary', fa: 'بهبود خلاصه', ps: 'لنډیز ښه کړئ' },
  generatePoints: { en: 'Generate Bullet Points', fa: 'تولید نکات کلیدی', ps: 'کلیدي ټکي جوړ کړئ' },
  currentSummary: { en: 'Current Professional Summary', fa: 'خلاصه مسلکی فعلی', ps: 'اوسنی مسلکي لنډیز' },
  generateCoverLetter: { en: 'Generate Cover Letter', fa: 'تولید نامه پوششی', ps: 'کاور لیټر جوړ کړئ' },
  copy: { en: 'Copy', fa: 'کپی', ps: 'کاپی' },
  copied: { en: 'Copied!', fa: 'کپی شد!', ps: 'کاپی شو!' },
  uploadSuccess: { en: 'Resume uploaded successfully!', fa: 'رزومه با موفقیت آپلود شد!', ps: 'ریزیوم په بریالیتوب سره پورته شو!' },
  editProfile: { en: 'Edit Profile', fa: 'ویرایش پروفایل', ps: 'پروفایل سم کړئ' },
  phone: { en: 'Phone', fa: 'تلیفون', ps: 'تلیفون' },
  email: { en: 'Email', fa: 'ایمیل', ps: 'بریښنالیک' },
  address: { en: 'Address', fa: 'آدرس', ps: 'پته' },
  bio: { en: 'Bio', fa: 'بیوگرافی', ps: 'پیژندنه' },
  saveChanges: { en: 'Save Changes', fa: 'ذخیره تغییرات', ps: 'بدلونونه خوندي کړئ' },
  applicationDetails: { en: 'Application Details', fa: 'جزئیات درخواست', ps: 'د غوښتنلیک تفصیلات' },
  interviews: { en: 'Interviews', fa: 'مصاحبه‌ها', ps: ' مرکې' },
  practiceHistory: { en: 'Practice History', fa: 'تاریخچه تمرین', ps: 'د تمرین تاریخ' },
  myReviews: { en: 'My Reviews', fa: 'نظرات من', ps: 'زما کتنې' },
  
  // Alerts
  jobAlerts: { en: 'Job Alerts', fa: 'هشدارهای شغلی', ps: 'د دندې خبرتیاوې' },
  createAlert: { en: 'Create Alert', fa: 'ایجاد هشدار', ps: 'خبرتیا جوړه کړئ' },
  noAlerts: { en: 'No job alerts active.', fa: 'هیچ هشدار شغلی فعال نیست.', ps: 'هیڅ د کار خبرتیا فعاله نه ده.' },
  alertCriteria: { en: 'Alert Criteria', fa: 'معیارهای هشدار', ps: 'د خبرتیا معیارونه' },
  frequency: { en: 'Frequency', fa: 'تکرار', ps: 'تعدد' },
  daily: { en: 'Daily', fa: 'روزانه', ps: 'هره ورځ' },
  weekly: { en: 'Weekly', fa: 'هفتگی', ps: 'هره اونۍ' },
  instant: { en: 'Instant', fa: 'فوری', ps: 'فوري' },
  notifications: { en: 'Notifications', fa: 'اعلان‌ها', ps: 'خبرتیاوې' },
  noNotifications: { en: 'No new notifications', fa: 'اعلان جدیدی وجود ندارد', ps: 'نوي خبرتیاوې نشته' },
  markAllRead: { en: 'Mark all as read', fa: 'علامت گذاری همه به عنوان خوانده شده', ps: 'ټول د لوستل شوي په توګه نښه کړئ' },

  // Admin
  adminDashboard: { en: 'Admin Dashboard', fa: 'داشبورد ادمین', ps: 'د اډمین ډشبورډ' },
  pendingJobs: { en: 'Pending Jobs', fa: 'وظایف در انتظار', ps: 'پاتې دندې' },
  allJobs: { en: 'All Jobs', fa: 'همه وظایف', ps: 'ټولې دندې' },
  approve: { en: 'Approve', fa: 'تایید', ps: 'تایید' },
  reject: { en: 'Reject', fa: 'رد', ps: 'رد' },
  delete: { en: 'Delete', fa: 'حذف', ps: 'حذف' },
  users: { en: 'Users', fa: 'کاربران', ps: 'کاروونکي' },
  settings: { en: 'Settings', fa: 'تنظیمات', ps: 'تنظیمات' },
  overview: { en: 'Overview', fa: 'بررسی اجمالی', ps: 'عمومي کتنه' },
  messages: { en: 'Messages', fa: 'پیام‌ها', ps: 'پیغامونه' },
  verifyCompany: { en: 'Verify Company', fa: 'تایید شرکت', ps: 'شرکت تایید کړئ' },
  
  // Companies
  industry: { en: 'Industry', fa: 'صنعت', ps: 'صنعت' },
  employees: { en: 'Employees', fa: 'کارمندان', ps: 'کارمندان' },
  visitWebsite: { en: 'Visit Website', fa: 'بازدید وب سایت', ps: 'ویب پاڼه وګورئ' },
  companyProfile: { en: 'Company Profile', fa: 'پروفایل شرکت', ps: 'د شرکت پروفایل' },
  openPositions: { en: 'Open Positions', fa: 'موقعیت‌های شغلی', ps: 'خلاصې دندې' },
  topCompanies: { en: 'Top Companies', fa: 'شرکت‌های برتر', ps: 'غوره شرکتونه' },
  reviews: { en: 'Reviews', fa: 'نظرات', ps: 'کتنې' },
  writeReview: { en: 'Write a Review', fa: 'نوشتن نظر', ps: 'یوه بیاکتنه ولیکئ' },
  rating: { en: 'Rating', fa: 'امتیاز', ps: 'درجه بندي' },
  submitReview: { en: 'Submit Review', fa: 'ارسال نظر', ps: 'بیاکتنه وسپارئ' },
  follow: { en: 'Follow', fa: 'دنبال کردن', ps: 'تعقیب' },
  
  // Tools
  salaryCalculator: { en: 'Salary Calculator', fa: 'ماشین حساب معاش', ps: 'د معاش محاسبه' },
  grossSalary: { en: 'Gross Monthly Salary', fa: 'معاش ناخالص ماهانه', ps: 'ټول میاشتنی معاش' },
  taxBracket: { en: 'Tax Bracket', fa: 'رده مالیاتی', ps: 'د مالیې برکټ' },
  tax: { en: 'Tax', fa: 'مالیات', ps: 'مالیه' },
  netSalary: { en: 'Net Salary', fa: 'معاش خالص', ps: 'خالص معاش' },
  calculate: { en: 'Calculate', fa: 'محاسبه', ps: 'محاسبه کړئ' },
  calcDisclaimer: { 
    en: 'Based on 2009 Afghanistan Income Tax Law. For reference only.', 
    fa: 'بر اساس قانون مالیات بر درآمد افغانستان ۲۰۰۹. فقط جهت اطلاع.', 
    ps: 'د ۲۰۰۹ کال د افغانستان د عایداتو د مالیاتو د قانون پر بنسټ. یوازې د معلوماتو لپاره.' 
  },
  results: { en: 'Results', fa: 'نتایج', ps: ' پایلې' },
  monthlyTakeHome: { en: 'Your estimated monthly take-home pay', fa: 'تخمین دریافتی ماهانه شما', ps: 'ستاسو اټکل شوی میاشتنی معاش' },
  taxReference: { en: 'Tax Reference Table', fa: 'جدول مرجع مالیاتی', ps: 'د مالیې مرجع جدول' },
  taxRate: { en: 'Tax Rate', fa: 'نرخ مالیات', ps: 'د مالیې نرخ' },
  calculation: { en: 'Calculation', fa: 'محاسبه', ps: 'محاسبه' },
  
  // Skills
  skillAssessment: { en: 'Skill Assessment', fa: 'ارزیابی مهارت', ps: 'د مهارت ارزونه' },
  takeQuiz: { en: 'Take quizzes to earn badges and showcase your skills.', fa: 'در آزمون‌ها شرکت کنید تا نشان دریافت کنید و مهارت‌های خود را نشان دهید.', ps: 'د بیجونو ترلاسه کولو او خپل مهارتونو ښودلو لپاره کوزونه واخلئ.' },
  back: { en: 'Back', fa: 'بازگشت', ps: 'شاته' },
  question: { en: 'Question', fa: 'سوال', ps: 'پوښتنه' },
  nextQuestion: { en: 'Next Question', fa: 'سوال بعدی', ps: 'بل پوښتنه' },
  congratulations: { en: 'Congratulations!', fa: 'تبریک!', ps: 'مبارک!' },
  keepPracticing: { en: 'Keep Practicing', fa: 'تمرین کنید', ps: 'تمرین ته دوام ورکړئ' },
  backToTopics: { en: 'Back to Topics', fa: 'بازگشت به موضوعات', ps: 'موضوعاتو ته بیرته ستنیدل' },
  
  // Interview
  interviewPrep: { en: 'Interview Prep', fa: 'آمادگی مصاحبه', ps: 'د مرکې چمتووالی' },
  analyzing: { en: 'Analyzing...', fa: 'در حال تحلیل...', ps: 'د تحلیل په حال کې...' },
  yourAnswer: { en: 'Your Answer', fa: 'پاسخ شما', ps: 'ستاسو ځواب' },
  feedback: { en: 'AI Feedback', fa: 'بازخورد هوش مصنوعی', ps: 'د AI فیډبیک' },
  getFeedback: { en: 'Get Feedback', fa: 'دریافت بازخورد', ps: 'فیډبیک ترلاسه کړئ' },
  prevQuestion: { en: 'Previous', fa: 'قبلی', ps: 'مخکینی' },
  
  // Match
  matchAnalysis: { en: 'Profile Match Analysis', fa: 'تحلیل تطابق پروفایل', ps: 'د پروفایل میچ تحلیل' },
  analyzeMatch: { en: 'Analyze Match', fa: 'تحلیل تطابق', ps: 'میچ تحلیل کړئ' },
  compatibility: { en: 'Compatibility', fa: 'سازگاری', ps: 'مطابقت' },
  strengths: { en: 'Strengths', fa: 'نقاط قوت', ps: 'قوي ټکي' },
  missingSkills: { en: 'Missing Skills', fa: 'مهارت‌های گمشده', ps: 'ورک شوي مهارتونه' },
  
  // Apply
  apply: { en: 'Apply', fa: 'درخواست', ps: 'غوښتنلیک' },
  coverLetter: { en: 'Cover Letter', fa: 'نامه پوششی', ps: 'کاور لیټر' },
  cancel: { en: 'Cancel', fa: 'لغو', ps: 'لغوه' },
  submitApplication: { en: 'Submit Application', fa: 'ارسال درخواست', ps: 'غوښتنلیک وسپارئ' },
  applicationSubmitted: { en: 'Application Submitted!', fa: 'درخواست ارسال شد!', ps: 'غوښتنلیک وسپارل شو!' },
  postedBy: { en: 'Posted By', fa: 'ارسال شده توسط', ps: 'لخوا ځړول شوی' },
  jobOverview: { en: 'Job Overview', fa: 'بررسی اجمالی وظیفه', ps: 'د دندې عمومي کتنه' },
  salary: { en: 'Salary', fa: 'معاش', ps: 'معاش' },
  experience: { en: 'Experience', fa: 'تجربه', ps: 'تجربه' },
  postedDate: { en: 'Posted Date', fa: 'تاریخ ارسال', ps: 'د خپریدو نیټه' },
  jobDescription: { en: 'Job Description', fa: 'شرح وظایف', ps: 'د دندې تفصیل' },
  responsibilities: { en: 'Responsibilities', fa: 'مسئولیت‌ها', ps: 'مسؤلیتونه' },
  requirements: { en: 'Requirements', fa: 'نیازمندی‌ها', ps: 'اړتیاوې' },
  practiceInterview: { en: 'Practice Interview', fa: 'تمرین مصاحبه', ps: 'د مرکې تمرین' },
  report: { en: 'Report', fa: 'گزارش', ps: 'راپور' },
  uploadResume: { en: 'Upload Resume', fa: 'آپلود رزومه', ps: 'ریزیوم پورته کړئ' },
  
  // Messages
  searchConversations: { en: 'Search conversations...', fa: 'جستجوی مکالمات...', ps: 'خبرې اترې وپلټئ...' },
  typeMessage: { en: 'Type a message...', fa: 'پیامی بنویسید...', ps: 'یو پیغام ولیکئ...' },
  online: { en: 'Online', fa: 'آنلاین', ps: 'آنلاین' },
  startConversation: { en: 'Start a conversation', fa: 'شروع مکالمه', ps: 'خبرې پیل کړئ' },
  yourConversations: { en: 'Your Conversations', fa: 'مکالمات شما', ps: 'ستاسو خبرې اترې' },
  
  // New Translations
  salaryExplorerTitle: { en: 'What are you worth?', fa: 'ارزش شغلی شما چقدر است؟', ps: 'ستاسو د کار ارزښت څومره دی؟' },
  salaryExplorerSubtitle: { en: 'Discover average salaries for any job title in Afghanistan to help you negotiate better.', fa: 'معاش متوسط برای هر عنوان شغلی در افغانستان را کشف کنید تا بهتر مذاکره کنید.', ps: 'په افغانستان کې د هرې دندې سرلیک لپاره اوسط معاش ومومئ تر تاسو سره په ښه خبرو اترو کې مرسته وکړي.' },
  careerTrajectory: { en: 'Career Trajectory', fa: 'مسیر شغلی', ps: 'د مسلک لاره' },
  estimatedSalary: { en: 'Estimated Salary for', fa: 'معاش تخمینی برای', ps: 'لپاره اټکل شوی معاش' },
  eventsTitle: { en: 'Upcoming Events', fa: 'رویدادهای آینده', ps: 'راتلونکې پیښې' },
  eventsSubtitle: { en: 'Network, learn, and grow your career with these opportunities.', fa: 'با این فرصت‌ها شبکه سازی کنید، یاد بگیرید و شغل خود را رشد دهید.', ps: 'شبکه جوړ کړئ، زده کړئ، او د دې فرصتونو سره خپل مسلک ته وده ورکړئ.' },
  referAndEarn: { en: 'Refer & Earn', fa: 'معرفی کنید و جایزه بگیرید', ps: 'راجع وکړئ او وګټئ' },
  referralText: { en: 'Invite friends to join Afghan Job Finder. Get premium badges when they sign up.', fa: 'دوستان خود را به افغان جاب فایندر دعوت کنید. وقتی ثبت نام کردند نشان‌های ویژه دریافت کنید.', ps: 'ملګرو ته بلنه ورکړئ چې د افغان جاب فائنډر سره یوځای شي. کله چې دوی لاسلیک کوي پریمیم بیجونه ترلاسه کړئ.' },
  copyLink: { en: 'Copy Link', fa: 'کپی لینک', ps: 'لینک کاپی کړئ' },
  rejectionReason: { en: 'Rejection Reason', fa: 'دلیل رد', ps: 'د رد لامل' },
  selectReason: { en: 'Select a reason', fa: 'یک دلیل انتخاب کنید', ps: 'یو دلیل وټاکئ' },
  reasonNotQualified: { en: 'Not enough experience', fa: 'تجربه کافی نیست', ps: 'کافي تجربه نشته' },
  reasonFilled: { en: 'Position filled', fa: 'موقعیت پر شده است', ps: 'دنده ډکه شوې' },
  reasonOther: { en: 'Other candidates were a better fit', fa: 'سایر کاندیداها مناسب‌تر بودند', ps: 'نور کاندیدان غوره وو' },

  // Miscellaneous
  recommendedJobs: { en: 'Recommended Jobs', fa: 'وظایف پیشنهادی', ps: 'وړاندیز شوې دندې' },
  matchScore: { en: 'Match Score', fa: 'امتیاز تطابق', ps: 'د میچ نمرې' },
  withdraw: { en: 'Withdraw', fa: 'انصراف', ps: 'بېرته اخیستل' },
  date: { en: 'Date', fa: 'تاریخ', ps: 'نیټه' },
  status: { en: 'Status', fa: 'وضعیت', ps: 'حالت' },
  actions: { en: 'Actions', fa: 'عملیات', ps: 'کړنې' },
  welcome: { en: 'Welcome', fa: 'خوش آمدید', ps: 'ښه راغلاست' },
  accessDenied: { en: 'Access Denied. Please login.', fa: 'دسترسی رد شد. لطفا وارد شوید.', ps: 'لاسرسی رد شو. مهرباني وکړئ ننوځئ.' },
  jobsFound: { en: 'Jobs Found', fa: 'وظیفه پیدا شد', ps: 'دندې وموندل شوې' },
  noJobsFound: { en: 'No jobs found matching your criteria.', fa: 'هیچ وظیفه‌ای با معیارهای شما یافت نشد.', ps: 'ستاسو د معیارونو سره سم هیڅ دندې ونه موندل شوې.' },
  popularCategories: { en: 'Popular Categories', fa: 'دسته‌بندی‌های محبوب', ps: 'مشهورې کټګورۍ' },
  viewAll: { en: 'View All', fa: 'مشاهده همه', ps: 'ټول وګورئ' },
  featuredJobs: { en: 'Featured Jobs', fa: 'وظایف ویژه', ps: 'ځانګړې دندې' },
  latestJobs: { en: 'Latest Jobs', fa: 'جدیدترین وظایف', ps: 'وروستۍ دندې' },
  areYouEmployer: { en: 'Are you an Employer?', fa: 'آیا کارفرما هستید؟', ps: 'ایا تاسو کارګمارونکی یاست؟' },
  employerCTA: { 
    en: 'Post jobs, find the best candidates, and streamline your hiring process with our advanced tools.', 
    fa: 'وظایف را ارسال کنید، بهترین نامزدها را پیدا کنید و روند استخدام خود را با ابزارهای پیشرفته ما ساده کنید.', 
    ps: 'دندې اعلان کړئ، غوره کاندیدان ومومئ، او زموږ د پرمختللي وسیلو سره خپله د ګمارنې پروسه ساده کړئ.' 
  },
  postJobFree: { en: 'Post a Job for Free', fa: 'ارسال رایگان وظیفه', ps: 'د وړیا لپاره دنده اعلان کړئ' },
  contactUs: { en: 'Contact Us', fa: 'تماس با ما', ps: 'موږ سره اړیکه ونیسئ' },
  message: { en: 'Message', fa: 'پیام', ps: 'پیغام' },
  subject: { en: 'Subject', fa: 'موضوع', ps: 'موضوع' },
  sendMessage: { en: 'Send Message', fa: 'ارسال پیام', ps: 'پیغام واستوئ' },
  messageSent: { en: 'Your message has been sent successfully.', fa: 'پیام شما با موفقیت ارسال شد.', ps: 'ستاسو پیغام په بریالیتوب سره لیږل شوی.' },
  privacyPolicy: { en: 'Privacy Policy', fa: 'سیاست حفظ حریم خصوصی', ps: 'د محرمیت تګلاره' },
  privacyContent: { 
    en: 'We value your privacy. This policy explains how we collect, use, and protect your personal information.', 
    fa: 'ما به حریم خصوصی شما اهمیت می‌دهیم. این سیاست توضیح می‌دهد که چگونه اطلاعات شخصی شما را جمع‌آوری، استفاده و محافظت می‌کنیم.', 
    ps: 'موږ ستاسو محرمیت ته ارزښت ورکوو. دا تګلاره تشریح کوي چې موږ څنګه ستاسو شخصي معلومات راټولوو، کاروو او ساتنه کوو.' 
  },
  termsOfService: { en: 'Terms of Service', fa: 'شرایط خدمات', ps: 'د خدمت شرایط' },
  termsContent: {
    en: 'By using our platform, you agree to these terms. Please read them carefully.',
    fa: 'با استفاده از پلتفرم ما، شما با این شرایط موافقت می‌کنید. لطفا آنها را با دقت بخوانید.',
    ps: 'زموږ د پلیټ فارم په کارولو سره، تاسو د دې شرایطو سره موافق یاست. مهرباني وکړئ دوی په دقت سره ولولئ.'
  },
  acceptanceOfTerms: { en: 'Acceptance of Terms', fa: 'پذیرش شرایط', ps: 'د شرایطو منل' },
  accounts: { en: 'Accounts', fa: 'حساب‌ها', ps: 'حسابونه' },
  jobPostings: { en: 'Job Postings', fa: 'آگهی‌های شغلی', ps: 'د دندې اعلانونه' },
  faq: { en: 'Frequently Asked Questions', fa: 'سوالات متداول', ps: 'پوښتل شوي پوښتنې' },
  faqContent: { en: 'Find answers to common questions about using our platform.', fa: 'پاسخ سوالات متداول درباره استفاده از پلتفرم ما را پیدا کنید.', ps: 'زموږ د پلیټ فارم کارولو په اړه عامو پوښتنو ته ځوابونه ومومئ.' },
  q1: { en: 'How do I apply for a job?', fa: 'چگونه برای یک وظیفه درخواست دهم؟', ps: 'زه څنګه د دندې لپاره غوښتنه وکړم؟' },
  a1: { 
    en: 'Create an account, complete your profile, browse jobs, and click "Apply Now" on any listing.', 
    fa: 'یک حساب ایجاد کنید، پروفایل خود را تکمیل کنید، وظایف را مرور کنید و روی "درخواست دهید" کلیک کنید.', 
    ps: 'اکاونټ جوړ کړئ، خپل پروفایل بشپړ کړئ، دندې وپلټئ، او په هر لیست کې "همدا اوس غوښتنه وکړئ" کلیک وکړئ.' 
  },
  q2: { en: 'Is it free for job seekers?', fa: 'آیا برای کارجویان رایگان است؟', ps: 'ایا دا د کار لټوونکو لپاره وړیا دی؟' },
  a2: { en: 'Yes, searching and applying for jobs is completely free.', fa: 'بله، جستجو و درخواست برای وظایف کاملا رایگان است.', ps: 'هو، د دندو لټون او غوښتنلیک په بشپړ ډول وړیا دی.' },
  q3: { en: 'How can I post a job?', fa: 'چگونه می‌توانم یک وظیفه ارسال کنم؟', ps: 'زه څنګه کولی شم دنده اعلان کړم؟' },
  a3: { 
    en: 'Register as an Employer, go to your dashboard, and click "Post a Job".', 
    fa: 'به عنوان کارفرما ثبت نام کنید، به داشبورد خود بروید و روی "ارسال وظیفه" کلیک کنید.', 
    ps: 'د کارګمارونکي په توګه راجستر کړئ، خپل ډشبورډ ته لاړشئ، او "دنده اعلان کړئ" کلیک وکړئ.' 
  },
  step3Title: { en: 'Get Hired', fa: 'استخدام شوید', ps: 'په کار ګمارل شئ' },
  step3Desc: { en: 'Connect with employers and start your new career journey.', fa: 'با کارفرمایان ارتباط برقرار کنید و سفر شغلی جدید خود را آغاز کنید.', ps: 'د کارګمارونکو سره اړیکه ونیسئ او خپل نوی مسلکي سفر پیل کړئ.' },
};
