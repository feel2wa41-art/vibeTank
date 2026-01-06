export interface Project {
  id: number;
  name: string;
  period: string;
  timeline: string;
  description: string;
  tags: string[];
  stats?: { value: string; label: string }[];
  features?: string[];
  icon: string;
  iconImage?: string; // Optional image path for logo (in public folder)
  color: string;
  startMonth: number; // 0-indexed (Jan = 0)
  endMonth: number;
  intermittentMonths?: number[]; // For projects active in scattered months
  details?: {
    overview?: string;
    responsibilities?: string[];
    technologies?: string[];
    achievements?: string[];
    challenges?: string[];
  };
  outputs?: {
    name: string;
    description: string;
    url: string;
    icon: 'web' | 'admin' | 'app' | 'ios' | 'android' | 'landing';
  }[];
}

export const projects: Project[] = [
  {
    id: 1,
    name: "KT Skylife",
    period: "JAN — JUL",
    timeline: "JAN 2025 — JUL 2025",
    description: "Led the comprehensive migration of legacy systems to Vue2 framework for KT Skylife, developing robust API integrations for new business services.",
    tags: ["Vue2 Migration", "API Development", "Legacy System"],
    stats: [
      { value: "2", label: "Team" },
      { value: "7", label: "Months" },
      { value: "100%", label: "Done" }
    ],
    icon: "🎯",
    iconImage: "/logos/kt-skylife.png",
    color: "#8bc34a",
    startMonth: 0,
    endMonth: 6,
    details: {
      //overview: "KT Skylife BCAP(Business Customer Admin Portal) 프로젝트는 기존 레거시 시스템을 현대적인 Vue2 프레임워크로 마이그레이션하는 대규모 프로젝트입니다.",
      overview: "The KT Skylife project is a large-scale initiative focused on migrating a legacy system to a modern Vue2-based architecture.",
      responsibilities: [
        //"프로젝트 전체 일정 및 리소스 관리",
        "Managed the overall project schedule and resource allocation",
        //"Vue2 프레임워크 아키텍처 설계",
        "Designed the Vue2 framework architecture",
        //"API 통합 및 백엔드 연동 개발",
        "Developed API integrations and backend connectivity",
        //"코드 리뷰 및 품질 관리",
         "Conducted code reviews and ensured quality control",
        //"고객사 커뮤니케이션 및 요구사항 조율"
          "Coordinated client communication and requirement alignment"
      ],
      technologies: ["Vue2", "Vuex", "Vue Router", "Axios", "Element UI", "Node.js", "REST API","JAVA", "JAVA script", "EJB","JSP","angularJS"],
      achievements: [
        //"레거시 시스템 대비 50% 성능 향상",
        "Achieved 50% performance improvement over legacy system",  
        "Improved user interface response speed by 3x",
        "Improved code maintainability",
        "Successful non-stop migration"
      ],
      challenges: [
        //"기존 시스템과의 데이터 호환성 확보",
        "Ensuring data compatibility with existing systems",
        "Real-time service without interruption during migration",
        "Reimplementation of complex business logic"
      ]
    }
  },
  {
    id: 2,
    name: "REKO HR System",
    period: "AUG — DEC",
    timeline: "AI-POWERED VIBE CODING",
    description: "Revolutionary HR management platform built using AI-assisted development. Web portals, iOS & Android apps with full HR features.",
    tags: ["AI Dev", "React", "Mobile Apps"],
    features: ["Attendance", "E-Approval", "KPI", "Reports", "Expenses", "Calendar"],
    icon: "⚡",
    iconImage: "/logos/reko-hr.png",
    color: "#7cb342",
    startMonth: 7,
    endMonth: 11,
    details: {
      //overview: "REKO HR System은 AI 기반 개발 방식(Vibe Coding)을 활용하여 구축한 혁신적인 HR 관리 플랫폼입니다. 웹, iOS, Android 모든 플랫폼을 지원합니다.",
      overview: "The REKO HR System is an innovative HR management platform built using an AI-assisted development approach (Vibe Coding). It supports web, iOS, and Android platforms.",
      responsibilities: [
        "AI-based development process design and implementation",
        "React Native mobile app architecture",
        "Next.js-based web portal development",
        "E-approval workflow design",
        "KPI dashboard and reporting system"
      ],
      technologies: ["React", "Next.js", "React Native", "TypeScript", "Node.js", "PostgreSQL", "Claude AI"],
      achievements: [
        "Development time reduced by 60% (AI utilization)",
        "Successful simultaneous release of 3 platforms",
        "User satisfaction rate of 95%",
        "HR task processing time reduced by 40%"
      ],
      challenges: [
        "Quality management of AI-generated code",
        "Cross-platform UI/UX consistency",
        "Complex e-approval workflow implementation"
      ]
    },
    outputs: [
      {
        name: "Admin Portal",
       // description: "Provider가 Customer를 관리하는 관리자 포털",  
        description: "Admin portal for Providers to manage Customers",
        url: "https://admin.reko-hr.com",
        icon: "admin"
      },
      {
        name: "Web App",
        //description: "Customer가 사용하는 HR 웹 애플리케이션",
        description: "HR web application used by Customers",
        url: "https://app.reko-hr.com",
        icon: "app"
      },
      {
        name: "Landing Page",
        //description: "REKO HR 소개 및 가입 홈페이지",
        description: "REKO HR introduction and sign-up homepage",
        url: "https://www.reko-hr.com",
        icon: "landing"
      },
      {
        name: "iOS App",
        //description: "App Store에서 다운로드 가능한 iOS 앱",
        description: "iOS app available for download on the App Store",
        url: "https://apps.apple.com/id/app/reko-hr/id6756481918",
        icon: "ios"
      },
      {
        name: "Android App",
        //description: "Google Play에서 다운로드 가능한 Android 앱",
        description: "Android app available for download on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.rekohr.mobile",
        icon: "android"
      }
    ]
  },
  {
    id: 3,
    name: "MTI xPlatform",
    period: "INTERMITTENT",
    timeline: "DLL PROTECTOR",
    description: "Advanced security solution to detect and prevent DLL injection and hacking attempts. Continuously updated for emerging threats.",
    tags: ["Security", "DLL Protection", "Anti-Hacking"],
    stats: [
      { value: "24/7", label: "Protection" },
      { value: "∞", label: "Updates" }
    ],
    icon: "🛡️",
    color: "#689f38",
    startMonth: 0,
    endMonth: 11,
    intermittentMonths: [3, 11], // April and December
    details: {
      //overview: "MTI xPlatform은 DLL 인젝션 및 해킹 시도를 탐지하고 차단하는 고급 보안 솔루션입니다. 지속적으로 새로운 위협에 대응하여 업데이트됩니다.",
      overview: "MTI xPlatform is an advanced security solution designed to detect and block DLL injection and hacking attempts. It is continuously updated to respond to emerging threats.",
      responsibilities: [
        "Security vulnerability analysis and patch development",
        "DLL injection detection algorithm improvement",
        "Real-time monitoring system management",
        "Security update deployment management",
        "Customer technical support and education"
      ],
      technologies: ["C++", "Windows API", "Kernel Driver", "Reverse Engineering"],
      achievements: [
        "DLL injection prevention",
        "Background program execution",
        "100% security incident prevention for clients",
        "Minimized system load"
      ],
      challenges: [
        "New hacking techniques in real-time response",
        "Security implementation without performance degradation",
        "Compatibility across various environments"
      ]
    }
  },
  {
    id: 4,
    name: "Security Assessment",
    period: "SEP — DEC",
    timeline: "SEP 2025 — ONGOING",
    description: "Comprehensive IT security assessment for KT Skylife infrastructure. Auditing physical servers, software systems, and IT management.",
    tags: ["IT Security", "Infrastructure", "Compliance"],
    stats: [
      { value: "360°", label: "Coverage" },
      { value: "Q4", label: "Timeline" }
    ],
    icon: "🔒",
    color: "#aed581",
    startMonth: 8,
    endMonth: 11,
    details: {
      //overview: "BCAP 인프라에 대한 종합적인 IT 보안 평가 프로젝트입니다. 물리적 서버, 소프트웨어 시스템, IT 관리 전반을 감사합니다.",
      overview: "A comprehensive IT security assessment project for BCAP infrastructure. It audits physical servers, software systems, and overall IT management.", 
      responsibilities: [
        "Infrastructure security vulnerability inspection",
        "Network security architecture analysis",
        "Access control policy review",
        "Security compliance evaluation",
        "Improvement recommendation writing and reporting"
      ],
      technologies: ["Nessus", "Burp Suite", "Wireshark", "OWASP ZAP", "Metasploit", "Nmap"],
      achievements: [ 
        //"고위험 취약점 식별",
        "Identification of high-risk vulnerabilities",        
        "Security policy improvement proposal",  
        "ISMS certification preparation",
        "Company-wide security awareness training"
      ],
      challenges: [
        "Email transmission file export inspection",
        "Security policy application for general file exports",
        "Server access control enhancement"
      ]
    }
  }
];

export const profileInfo = {
  name: "TANK",
  role: "GDC Project Manager",
  year: 2025,
  tagline: "Building the Future, One Mission at a Time",
  footer: "© 2025 TANK — ALL SYSTEMS OPERATIONAL"
};

export const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
