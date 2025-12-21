
import { Job, TranslationDictionary, Application, User, UserRole, Report, Review, BlogPost, ChatMessage, CommunityPost, InterviewSession, SystemAnnouncement, Event } from './types';

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
    _id: 'post1',
    authorId: 'emp1',
    authorName: 'Tech Solutions Afghan',
    authorAvatar: 'https://ui-avatars.com/api/?name=Tech+Solutions&background=0D8ABC&color=fff',
    authorRole: UserRole.EMPLOYER,
    content: "We are excited to announce our new partnership with Microsoft! This will open up 50+ new jobs in Kabul for Cloud Engineers. Stay tuned!",
    likes: ['seeker1'],
    comments: [
        { _id: 'c1', authorId: 'seeker1', authorName: 'Ahmad Wali', content: 'This is amazing news! Congratulations.', timestamp: '2023-11-15T10:30:00Z' }
    ],
    timestamp: '2023-11-15T09:00:00Z'
  },
  {
    _id: 'post2',
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
    _id: 'ann1',
    title: 'Platform Maintenance',
    message: 'We will be undergoing scheduled maintenance on Friday at 2:00 AM. The site will be unavailable for approximately 1 hour.',
    type: 'Warning',
    targetAudience: 'All',
    createdAt: '2023-11-20',
    isActive: true
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    _id: 'evt1',
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
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    _id: '1',
    title: "Top 10 In-Demand Skills in Afghanistan for 2024",
    excerpt: "Discover the skills that employers in Kabul and beyond are desperately looking for this year.",
    content: `<p>The job market in Afghanistan is evolving rapidly...</p>`,
    date: "Oct 25, 2023",
    author: "Tech Solutions Afghan",
    authorId: "emp1",
    role: "Employer",
    image: "https://picsum.photos/id/1/800/400",
    category: "Market Trends",
    readTime: "5 min read",
    status: 'Published'
  }
];

export const MOCK_USERS: User[] = [
  {
    _id: 'emp1',
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
        linkedin: "https://linkedin.com/company/techsolutions-af"
    },
    gallery: [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ]
  },
  {
    _id: 'seeker1',
    name: 'Ahmad Wali',
    email: 'ahmad@example.com',
    role: UserRole.SEEKER,
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Wali&background=random',
    status: 'Active',
    plan: 'Free',
    jobTitle: 'Frontend Developer',
    bio: 'Experienced React developer with 3 years of experience.',
    address: 'Herat, Afghanistan',
    phone: '+93 700 123 456',
    resume: 'ahmad_resume.pdf',
    resumeData: MOCK_PDF_BASE64,
    following: ['emp1'],
    documents: [
        {
            _id: 'doc1',
            name: 'ahmad_resume_tech.pdf',
            type: 'Resume',
            data: MOCK_PDF_BASE64,
            date: '2023-10-15',
            size: '240 KB'
        }
    ],
    experience: [
      {
        _id: 'exp1',
        title: 'Frontend Developer',
        company: 'Tech Solutions Afghan',
        startDate: 'Jan 2021',
        endDate: 'Present',
        description: 'Developing responsive web applications using React.'
      }
    ],
    education: [
      {
        _id: 'edu1',
        degree: 'Bachelor of Computer Science',
        school: 'Kabul University',
        startDate: '2015',
        endDate: '2019'
      }
    ],
    verifiedSkills: ['React', 'JavaScript']
  }
];

export const MOCK_JOBS: Job[] = [
  {
    _id: 'job1',
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
    description: 'We are looking for an experienced React Developer.',
    requirements: ['3+ years React', 'TypeScript'],
    responsibilities: ['Develop features', 'Code review'],
    isFeatured: true,
    status: 'Active'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    _id: 'app1',
    jobId: 'job1',
    seekerId: 'seeker1',
    resumeUrl: 'ahmad_resume.pdf',
    resumeData: MOCK_PDF_BASE64,
    coverLetter: 'I am very interested in this role.',
    status: 'Applied',
    date: '2023-10-26',
    timeline: [
        { status: 'Applied', date: '2023-10-26', note: 'Application submitted' }
    ]
  }
];

export const MOCK_REPORTS: Report[] = [];
export const MOCK_REVIEWS: Review[] = [
  {
    _id: 'rev1',
    companyId: 'emp1',
    userId: 'seeker1',
    userName: 'Ahmad Wali',
    rating: 5,
    comment: 'Great work environment.',
    date: '2023-11-10'
  }
];

export const MOCK_INTERVIEW_SESSIONS: InterviewSession[] = [];
export const MOCK_MESSAGES: ChatMessage[] = [
  {
    _id: 'msg1',
    senderId: 'emp1',
    receiverId: 'seeker1',
    content: 'Hello Ahmad, thanks for applying.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false
  }
];

export const TRANSLATIONS: TranslationDictionary = {
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
  heroTitle: { en: 'Find Your Dream Job in Afghanistan', fa: 'شغل رویایی خود را در افغانستان پیدا کنید', ps: 'په افغانستان کې خپله د خوښې دنده ومومئ' },
  heroSubtitle: { en: 'Connecting talent with opportunity.', fa: 'اتصال استعدادها با فرصت‌ها.', ps: 'د فرصتونو سره د وړتیا نښلول.' },
  searchPlaceholder: { en: 'Job title, keywords...', fa: 'عنوان وظیفه، کلمات کلیدی...', ps: 'د دندې سرلیک، کلیدي ټکي...' },
  locationPlaceholder: { en: 'City or Province', fa: 'شهر یا ولایت', ps: 'ښار یا ولایت' },
  searchButton: { en: 'Search', fa: 'جستجو', ps: 'لټون' },
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
  applyNow: { en: 'Apply Now', fa: 'درخواست دهید', ps: 'همدا اوس غوښتنه وکړئ' },
  details: { en: 'View Details', fa: 'جزئیات', ps: 'جزئیات' },
  posted: { en: 'Posted', fa: 'منتشر شده', ps: 'خپور شوی' },
  postJob: { en: 'Post a Job', fa: 'ارسال وظیفه', ps: 'دنده اعلان کړئ' },
  aiHelp: { en: 'Generate with AI', fa: 'تولید با هوش مصنوعی', ps: 'د AI سره تولید کړئ' },
  employerDashboard: { en: 'Employer Dashboard', fa: 'داشبورد کارفرما', ps: 'د کارګمارونکي ډشبورډ' },
  activeJobs: { en: 'Active Jobs', fa: 'وظایف فعال', ps: 'فعاله دندې' },
  totalApplications: { en: 'Total Applications', fa: 'مجموع درخواست‌ها', ps: 'ټول غوښتنلیکونه' },
  viewsThisWeek: { en: 'Views this week', fa: 'بازدیدهای این هفته', ps: 'په دې اونۍ کې لیدنې' },
  jobTitle: { en: 'Job Title', fa: 'عنوان وظیفه', ps: 'د دندې سرلیک' },
  requiredSkills: { en: 'Required Skills', fa: 'مهارت‌های مورد نیاز', ps: 'اړین مهارتونه' },
  generating: { en: 'Generating...', fa: 'در حال تولید...', ps: 'د تولید په حال کې...' },
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
  salaryCalculator: { en: 'Salary Calculator', fa: 'ماشین حساب معاش', ps: 'د معاش محاسبه' },
  grossSalary: { en: 'Gross Monthly Salary', fa: 'معاش ناخالص ماهانه', ps: 'ټول میاشتنی معاش' },
  taxBracket: { en: 'Tax Bracket', fa: 'رده مالیاتی', ps: 'د مالیې برکټ' },
  tax: { en: 'Tax', fa: 'مالیات', ps: 'مالیه' },
  netSalary: { en: 'Net Salary', fa: 'معاش خالص', ps: 'خ خالص معاش' },
  calculate: { en: 'Calculate', fa: 'محاسبه', ps: 'محاسبه کړئ' },
  calcDisclaimer: { en: 'Based on 2009 Afghanistan Income Tax Law.', fa: 'بر اساس قانون مالیات افغانستان ۲۰۰۹.', ps: 'د ۲۰۰۹ کال د مالیاتو د قانون پر بنسټ.' },
  results: { en: 'Results', fa: 'نتایج', ps: ' پایلې' },
  monthlyTakeHome: { en: 'Estimated monthly take-home pay', fa: 'تخمین دریافتی ماهانه', ps: 'اټکل شوی میاشتنی معاش' },
  taxReference: { en: 'Tax Reference Table', fa: 'جدول مرجع مالیاتی', ps: 'د مالیې مرجع جدول' },
  taxRate: { en: 'Tax Rate', fa: 'نرخ مالیات', ps: 'د مالیې نرخ' },
  calculation: { en: 'Calculation', fa: 'محاسبه', ps: 'محاسبه' },
  skillAssessment: { en: 'Skill Assessment', fa: 'ارزیابی مهارت', ps: 'د مهارت ارزونه' },
  takeQuiz: { en: 'Take quizzes to earn badges.', fa: 'در آزمون‌ها شرکت کنید تا نشان بگیرید.', ps: 'د بیجونو لپاره کوزونه واخلئ.' },
  back: { en: 'Back', fa: 'بازگشت', ps: 'شاته' },
  question: { en: 'Question', fa: 'سوال', ps: 'پوښتنه' },
  nextQuestion: { en: 'Next Question', fa: 'سوال بعدی', ps: 'بل پوښتنه' },
  congratulations: { en: 'Congratulations!', fa: 'تبریک!', ps: 'مبارک!' },
  keepPracticing: { en: 'Keep Practicing', fa: 'تمرین کنید', ps: 'تمرین ته دوام ورکړئ' },
  backToTopics: { en: 'Back to Topics', fa: 'بازگشت به موضوعات', ps: 'موضوعاتو ته بیرته ستنیدل' },
  interviewPrep: { en: 'Interview Prep', fa: 'آمادگی مصاحبه', ps: 'د مرکې چمتووالی' },
  analyzing: { en: 'Analyzing...', fa: 'در حال تحلیل...', ps: 'د تحلیل په حال کې...' },
  yourAnswer: { en: 'Your Answer', fa: 'پاسخ شما', ps: 'ستاسو ځواب' },
  feedback: { en: 'AI Feedback', fa: 'بازخورد هوش مصنوعی', ps: 'د AI فیډبیک' },
  getFeedback: { en: 'Get Feedback', fa: 'دریافت بازخورد', ps: 'فیډبیک ترلاسه کړئ' },
  prevQuestion: { en: 'Previous', fa: 'قبلی', ps: 'مخکینی' },
  matchAnalysis: { en: 'Profile Match Analysis', fa: 'تحلیل تطابق پروفایل', ps: 'د پروفایل میچ تحلیل' },
  analyzeMatch: { en: 'Analyze Match', fa: 'تحلیل تطابق', ps: 'میچ تحلیل کړئ' },
  compatibility: { en: 'Compatibility', fa: 'سازگاری', ps: 'مطابقت' },
  strengths: { en: 'Strengths', fa: 'نقاط قوت', ps: 'قوي ټکي' },
  missingSkills: { en: 'Missing Skills', fa: 'مهارت‌های گمشده', ps: 'ورک شوي مهارتونه' },
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
  searchConversations: { en: 'Search conversations...', fa: 'جستجوی مکالمات...', ps: 'خبرې اترې وپلټئ...' },
  typeMessage: { en: 'Type a message...', fa: 'پیامی بنویسید...', ps: 'یو پیغام ولیکئ...' },
  online: { en: 'Online', fa: 'آنلاین', ps: 'آنلاین' },
  startConversation: { en: 'Start a conversation', fa: 'شروع مکالمه', ps: 'خبرې پیل کړئ' },
  yourConversations: { en: 'Your Conversations', fa: 'مکالمات شما', ps: 'ستاسو خبرې اترې' },
  salaryExplorerTitle: { en: 'What are you worth?', fa: 'ارزش شغلی شما چقدر است؟', ps: 'ستاسو د کار ارزښت څومره دی؟' },
  salaryExplorerSubtitle: { en: 'Discover average salaries.', fa: 'معاش متوسط را کشف کنید.', ps: 'اوسط معاشونه ومومئ.' },
  careerTrajectory: { en: 'Career Trajectory', fa: 'مسیر شغلی', ps: 'د مسلک لاره' },
  estimatedSalary: { en: 'Estimated Salary for', fa: 'معاش تخمینی برای', ps: 'لپاره اټکل شوی معاش' },
  eventsTitle: { en: 'Upcoming Events', fa: 'رویدادهای آینده', ps: 'راتلونکې پیښې' },
  eventsSubtitle: { en: 'Network and learn.', fa: 'شبکه سازی و یادگیری.', ps: 'شبکه او زده کړه.' },
  referAndEarn: { en: 'Refer & Earn', fa: 'معرفی کنید و جایزه بگیرید', ps: 'راجع وکړئ او وګټئ' },
  referralText: { en: 'Invite friends.', fa: 'دوستان خود را دعوت کنید.', ps: 'ملګرو ته بلنه ورکړئ.' },
  copyLink: { en: 'Copy Link', fa: 'کپی لینک', ps: 'لینک کاپی کړئ' },
  rejectionReason: { en: 'Rejection Reason', fa: 'دلیل رد', ps: 'د رد لامل' },
  selectReason: { en: 'Select a reason', fa: 'یک دلیل انتخاب کنید', ps: 'یو دلیل وټاکئ' },
  reasonNotQualified: { en: 'Not enough experience', fa: 'تجربه کافی نیست', ps: 'کافي تجربه نشته' },
  reasonFilled: { en: 'Position filled', fa: 'موقعیت پر شده است', ps: 'دنده ډکه شوې' },
  reasonOther: { en: 'Other candidates were a better fit', fa: 'سایر کاندیداها مناسب‌تر بودند', ps: 'نور کاندیدان غوره وو' },
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
  employerCTA: { en: 'Post jobs, find candidates.', fa: 'وظایف را ارسال کنید.', ps: 'دندې اعلان کړئ.' },
  postJobFree: { en: 'Post a Job for Free', fa: 'ارسال رایگان وظیفه', ps: 'د وړیا لپاره دنده اعلان کړئ' },
  contactUs: { en: 'Contact Us', fa: 'تماس با ما', ps: 'موږ سره اړیکه ونیسئ' },
  message: { en: 'Message', fa: 'پیام', ps: 'پیغام' },
  subject: { en: 'Subject', fa: 'موضوع', ps: 'موضوع' },
  sendMessage: { en: 'Send Message', fa: 'ارسال پیام', ps: 'پیغام واستوئ' },
  messageSent: { en: 'Your message has been sent successfully.', fa: 'پیام شما با موفقیت ارسال شد.', ps: 'ستاسو پیغام په بریالیتوب سره لیږل شوی.' },
  privacyPolicy: { en: 'Privacy Policy', fa: 'سیاست حفظ حریم خصوصی', ps: 'د محرمیت تګلاره' },
  privacyContent: { en: 'We value your privacy.', fa: 'ما به حریم خصوصی شما اهمیت می‌دهیم.', ps: 'موږ ستاسو محرمیت ته ارزښت ورکوو.' },
  termsOfService: { en: 'Terms of Service', fa: 'شرایط خدمات', ps: 'د خدمت شرایط' },
  termsContent: { en: 'By using our platform...', fa: 'با استفاده از پلتفرم ما...', ps: 'زموږ د پلیټ فارم په کارولو سره...' },
  acceptanceOfTerms: { en: 'Acceptance of Terms', fa: 'پذیرش شرایط', ps: 'د شرایطو منل' },
  accounts: { en: 'Accounts', fa: 'حساب‌ها', ps: 'حسابونه' },
  jobPostings: { en: 'Job Postings', fa: 'آگهی‌های شغلی', ps: 'د دندې اعلانونه' },
  faq: { en: 'Frequently Asked Questions', fa: 'سوالات متداول', ps: 'پوښتل شوي پوښتنې' },
  faqContent: { en: 'Find answers.', fa: 'پاسخ‌ها را پیدا کنید.', ps: 'ځوابونه ومومئ.' },
  q1: { en: 'How do I apply for a job?', fa: 'چگونه برای یک وظیفه درخواست دهم؟', ps: 'زه څنګه د دندې لپاره غوښتنه وکړم؟' },
  a1: { en: 'Create an account and click "Apply Now".', fa: 'یک حساب ایجاد کنید و روی "درخواست دهید" کلیک کنید.', ps: 'اکاونټ جوړ کړئ او "همدا اوس غوښتنه وکړئ" کلیک وکړئ.' },
  q2: { en: 'Is it free for job seekers?', fa: 'آیا برای کارجویان رایگان است؟', ps: 'ایا دا د کار لټوونکو لپاره وړیا دی؟' },
  a2: { en: 'Yes, searching and applying for jobs is free.', fa: 'بله، جستجو و درخواست رایگان است.', ps: 'هو، د دندو لټون او غوښتنلیک وړیا دی.' },
  q3: { en: 'How can I post a job?', fa: 'چگونه می‌توانم یک وظیفه ارسال کنم؟', ps: 'زه څنګه کولی شم دنده اعلان کړم؟' },
  a3: { en: 'Register as an Employer and click "Post a Job".', fa: 'به عنوان کارفرما ثبت نام کنید.', ps: 'د کارګمارونکي په توګه راجستر کړئ.' },
  step3Title: { en: 'Get Hired', fa: 'استخدام شوید', ps: 'په کار ګمارل شئ' },
  step3Desc: { en: 'Connect with employers.', fa: 'با کارفرمایان ارتباط برقرار کنید.', ps: 'د کارګمارونکو سره اړیکه ونیسئ.' },
  following: { en: 'Following', fa: 'در حال دنبال کردن', ps: 'تعقیب کیږي' },
};
