/**
 * DATA PORTOFOLIO YUDHA
 * Anda dapat dengan mudah mengubah atau menambahkan data di file ini.
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Yudha",
    role: "Full-Stack Developer & UI/UX Designer",
    tagline: "Membangun produk digital yang cepat, elegan, dan berdampak nyata bagi pengguna.",
    status: "Tersedia untuk Proyek Baru & Full-time",
    location: "Indonesia",
    email: "yudha.dev@example.com",
    whatsapp: "+6281234567890",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    bio: "Saya adalah software developer dengan passion mendalam dalam membangun aplikasi web modern berskala tinggi, antarmuka pengguna yang memikat, serta arsitektur backend yang kokoh. Berfokus pada kode yang bersih, performa optimal, dan pengalaman pengguna yang mulus.",
    stats: [
      { label: "Proyek Selesai", value: 24, suffix: "+" },
      { label: "Tahun Pengalaman", value: 3, suffix: "+" },
      { label: "Klien & Partner", value: 18, suffix: "+" },
      { label: "Tingkat Kepuasan", value: 99, suffix: "%" }
    ]
  },

  skills: {
    frontend: [
      { name: "React / Next.js", level: 92, icon: "react" },
      { name: "TypeScript / JavaScript (ES6+)", level: 90, icon: "typescript" },
      { name: "Tailwind CSS & Modern CSS", level: 95, icon: "tailwind" },
      { name: "HTML5 & Semantic Web", level: 98, icon: "html" },
      { name: "State Management (Redux/Zustand)", level: 85, icon: "state" },
      { name: "Vue.js / Nuxt", level: 78, icon: "vue" }
    ],
    backend: [
      { name: "Node.js & Express", level: 88, icon: "node" },
      { name: "RESTful & GraphQL API", level: 90, icon: "api" },
      { name: "PostgreSQL & Prisma ORM", level: 84, icon: "postgres" },
      { name: "MongoDB & Mongoose", level: 86, icon: "mongodb" },
      { name: "Python / FastAPI", level: 75, icon: "python" },
      { name: "Authentication (OAuth / JWT)", level: 88, icon: "auth" }
    ],
    tools: [
      { name: "Git & GitHub Workflow", level: 92, icon: "git" },
      { name: "Docker & Containerization", level: 78, icon: "docker" },
      { name: "CI/CD & Deployment (Vercel/Cloud)", level: 85, icon: "cloud" },
      { name: "Figma & UI/UX Prototyping", level: 82, icon: "figma" },
      { name: "Linux & Bash Scripting", level: 80, icon: "linux" },
      { name: "Testing (Jest / Playwright)", level: 76, icon: "test" }
    ]
  },

  projects: [
    {
      id: "nexus-commerce",
      title: "Nexus Commerce - E-Commerce Platform Modern",
      category: "web",
      categoryLabel: "Web Application",
      description: "Platform e-commerce modern dengan fitur katalog pintar, payment gateway instan, keranjang belanja real-time, dan dashboard admin terpadu.",
      fullDescription: "Nexus Commerce dirancang untuk memberikan pengalaman berbelanja daring super cepat dengan skor performa Google Lighthouse 98+. Terintegrasi dengan sistem inventaris waktu-nyata, gateway pembayaran mutakhir, dan analitik penjualan dinamis.",
      features: [
        "Sistem keranjang belanja & checkout multikanal yang responsif",
        "Integrasi Payment Gateway otomatis (QRIS, VA, Kartu Kredit)",
        "Manajemen stok real-time dengan notifikasi otomatis",
        "Dashboard analitik penjualan & laporan keuangan ekspor PDF/Excel"
      ],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Stripe API"],
      image: "assets/images/projects/project-1.svg",
      demoUrl: "https://example.com/demo-ecommerce",
      githubUrl: "https://github.com/example/nexus-commerce",
      highlights: "98+ Lighthouse Score • Zero Lag Checkout"
    },
    {
      id: "synapse-ai",
      title: "Synapse AI - Dashboard Analitik & Model Intelejen",
      category: "fullstack",
      categoryLabel: "AI & Full-Stack",
      description: "Dashboard enterprise untuk monitoring performa model AI, konsumsi token real-time, dan analitik visual data tingkat tinggi.",
      fullDescription: "Aplikasi analitik berbasis SaaS yang memonitor jutaan inferensi AI setiap harinya. Menggunakan arsitektur websocket untuk data live streaming serta visualisasi grafik interaktif dengan latency sub-50ms.",
      features: [
        "Monitoring latensi dan kuota token LLM secara real-time",
        "Visualisasi grafik interaktif berbasis SVG Canvas performa tinggi",
        "Manajemen multi-API key dengan sistem role-based access control (RBAC)",
        "Alert system via Webhook & Telegram saat terjadi error rate spike"
      ],
      techStack: ["React", "TypeScript", "Node.js", "WebSocket", "Chart.js", "Docker"],
      image: "assets/images/projects/project-2.svg",
      demoUrl: "https://example.com/demo-synapse",
      githubUrl: "https://github.com/example/synapse-ai-dashboard",
      highlights: "Sub-50ms Latency • Real-Time Stream"
    },
    {
      id: "taskflow-pro",
      title: "TaskFlow Pro - Kolaborasi Kanban & Manajemen Tim",
      category: "web",
      categoryLabel: "Web Application",
      description: "Aplikasi manajemen proyek kolaboratif dengan papan Kanban interaktif drag-and-drop, sprint tracker, dan otomasi alur kerja.",
      fullDescription: "Solusi produktivitas bagi tim software development dan agensi kreatif. Memungkinkan pembagian sprint yang terstruktur, integrasi GitHub commits, serta kolaborasi multi-user seketika tanpa refresh halaman.",
      features: [
        "Drag and drop interaktif yang lancar di mobile dan desktop",
        "Kolaborasi multi-pengguna real-time menggunakan WebSocket",
        "Notifikasi tenggat waktu otomatis dan pengingat pintar",
        "Filter lanjutan berdasarkan prioritas, tag, dan anggota tim"
      ],
      techStack: ["Vue.js", "Tailwind CSS", "Express.js", "MongoDB", "Socket.io"],
      image: "assets/images/projects/project-3.svg",
      demoUrl: "https://example.com/demo-taskflow",
      githubUrl: "https://github.com/example/taskflow-pro",
      highlights: "Smooth Drag & Drop • Multi-User Sync"
    },
    {
      id: "paypulse-fintech",
      title: "PayPulse - Dompet Digital & Portofolio Investasi",
      category: "mobile",
      categoryLabel: "Fintech & Mobile UI",
      description: "Aplikasi finansial mobile web responsif untuk transfer instan, pelacak pengeluaran harian, dan grafik portofolio investasi.",
      fullDescription: "Mengedepankan keamanan tingkat tinggi dan micro-interactions yang intuitif. Membantu pengguna memantau arus kas pribadi, tagihan rutin, serta simulasi imbal hasil investasi dalam satu sentuhan.",
      features: [
        "Kategorisasi pengeluaran otomatis berbasis algoritma cerdas",
        "Simulasi investasi reksadana & obligasi interaktif",
        "Autentikasi biometrik & PIN dengan enkripsi end-to-end",
        "Ekspor mutasi rekening dan laporan pajak format CSV"
      ],
      techStack: ["React Native Web", "TypeScript", "Tailwind CSS", "Node.js", "Redis"],
      image: "assets/images/projects/project-4.svg",
      demoUrl: "https://example.com/demo-paypulse",
      githubUrl: "https://github.com/example/paypulse-fintech",
      highlights: "Enkripsi Aman • Micro-Interactions"
    },
    {
      id: "aura-ui",
      title: "Aura UI - Modern Accessible Design System",
      category: "design",
      categoryLabel: "Design System & UI/UX",
      description: "Sistem desain open-source yang memuat 40+ komponen siap pakai dengan standar aksesibilitas WCAG 2.1 AA dan tema kustom.",
      fullDescription: "Diciptakan untuk mempercepat proses pembuatan prototipe dan aplikasi web berskala besar. Kompatibel penuh dengan Tailwind CSS dan mendukung transisi animasi halus dengan ukuran bundel ultra-ringan.",
      features: [
        "40+ komponen teruji (Modals, Dropdowns, Datepickers, dll.)",
        "Mendukung Dark Mode native dan CSS variables theming",
        "100% ramah pembaca layar (screen-reader friendly)",
        "Dokumentasi interaktif dengan live code editor"
      ],
      techStack: ["HTML5", "CSS3 / Vanilla", "TypeScript", "Figma", "Storybook"],
      image: "assets/images/projects/project-5.svg",
      demoUrl: "https://example.com/demo-aura-ui",
      githubUrl: "https://github.com/example/aura-design-system",
      highlights: "WCAG 2.1 AA • Zero Dependencies"
    },
    {
      id: "fitpulse-tracker",
      title: "FitPulse - Pelacak Kebugaran & Nutrisi Harian",
      category: "web",
      categoryLabel: "Web Application",
      description: "Platform pencatat aktivitas olahraga, kalori harian, hidrasi, dan pembentukan kebiasaan hidup sehat dengan gamifikasi streak.",
      fullDescription: "Aplikasi kesehatan komprehensif yang memotivasi pengguna melalui visualisasi cincin target harian, rekomendasi menu gizi seimbang, dan papan peringkat komunitas.",
      features: [
        "Visualisasi cincin progres target kalori dan durasi olahraga",
        "Pencatat asupan air minum dengan pengingat ramah",
        "Statistik mingguan dan bulanan tren penurunan lemak/massa otot",
        "Gamifikasi badge pencapaian dan streak konsistensi"
      ],
      techStack: ["React", "Tailwind CSS", "Supabase", "PWA Offline"],
      image: "assets/images/projects/project-6.svg",
      demoUrl: "https://example.com/demo-fitpulse",
      githubUrl: "https://github.com/example/fitpulse-tracker",
      highlights: "PWA Offline Ready • Interactive Rings"
    }
  ],

  experience: [
    {
      year: "2024 - Sekarang",
      role: "Senior Frontend & Web Developer",
      company: "Tech Inovasi Digital",
      description: "Memimpin perancangan frontend untuk produk SaaS enterprise, mengoptimalkan kecepatan muat halaman sebesar 45%, dan mengimplementasikan sistem desain modular."
    },
    {
      year: "2022 - 2024",
      role: "Full-Stack Web Developer",
      company: "Kreatif Studio Nusantara",
      description: "Membangun 15+ website klien dan aplikasi web dinamis dengan React, Node.js, dan database SQL/NoSQL. Mengintegrasikan berbagai API pembayaran lokal."
    },
    {
      year: "2021 - 2022",
      role: "Junior Web Developer & UI Designer",
      company: "Digital Solusindo",
      description: "Bertanggung jawab atas slicing desain Figma ke kode HTML/CSS responsif, perbaikan bug UI/UX, dan pemeliharaan website berkala."
    }
  ],

  education: [
    {
      year: "2019 - 2023",
      degree: "Sarjana Komputer (S.Kom) - Teknik Informatika",
      institution: "Universitas Teknologi Indonesia",
      description: "Fokus pada Rekayasa Perangkat Lunak, Arsitektur Sistem Web, dan Interaksi Manusia & Komputer. Lulus dengan predikat Sangat Memuaskan (IPK 3.82)."
    },
    {
      year: "2023",
      degree: "Sertifikasi Profesional Full-Stack Developer",
      institution: "Global Tech Academy",
      description: "Pelatihan intensif arsitektur cloud, mikroservis, performa web, dan keamanan aplikasi web modern."
    }
  ],

  testimonials: [
    {
      name: "Budi Santoso",
      role: "CEO di RetailSmart Indonesia",
      avatar: "assets/images/avatar-placeholder.svg",
      text: "Yudha adalah developer yang sangat berdedikasi. Beliau berhasil menyelesaikan platform e-commerce kami lebih cepat dari target dengan kualitas kode yang sangat rapi dan performa yang luar biasa cepat!"
    },
    {
      name: "Siti Rahmawati",
      role: "Product Manager di FintechPlus",
      avatar: "assets/images/avatar-placeholder.svg",
      text: "Kerja sama dengan Yudha selalu memuaskan. Komunikasi sangat lancar, solusi teknis yang diberikan tepat sasaran, dan antarmuka yang dihasilkan sangat estetik serta mudah digunakan oleh pengguna kami."
    },
    {
      name: "Kevin Pratama",
      role: "Founder di StartupX Asia",
      avatar: "assets/images/avatar-placeholder.svg",
      text: "Salah satu talenta terbaik dalam fullstack web development. Keahliannya menggabungkan estetika UI/UX dengan kestabilan sistem backend sangat langka dan bernilai tinggi."
    }
  ]
};

// Make available globally
if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
