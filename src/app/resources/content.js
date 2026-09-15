import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Thirumalai",
  lastName: "Nambi ",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Aspiring AI/ML Engineer, Data Scientist & Full-Stack Developer",
  avatar: "/images/Nambi-passport-nobg.png",
  heroAvatar: "/images/Nambi-full-nobg.png",
  heroAvatarHover: "/images/Nambi-ginili.png",
  resume: "/resume/Thirumalai-Nambi-Resume.pdf",
  email: "thirumalainambi.official@gmail.com",
  phone: "+91 99622 08939",
  city: "Chennai, India",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Tamil"], // optional: Leave the array empty if you don't want to display languages
  linkedin: "https://www.linkedin.com/in/thirumalai-nambi-s/",
  youtube: "https://www.youtube.com/@Thirumalai-Nambi-S",
};

const newsletter = {
  display: true,
  title: <>Connect with Nambi's Insight Capsule</>,
  description: (
    <>
       I explore how data shapes the future—through analytics, machine learning, and the art of turning complexity into clarity.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Thirumalai-Nambi-S",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/thirumalai-nambi-s/",
  },
  {
    name: "YouTube",
    icon: "youtube",
    link: "https://www.youtube.com/@Thirumalai-Nambi-S",
  },
  {
    name: "X",
    icon: "x",
    link: "",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:thirumalainambi.official@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: (
    <>
      Building Intelligent Systems That{" "}
      <span className="gradient-text">Learn, Predict, and Decide</span>
    </>
  ),

  subline: (
    <p>
      I'm Nambi, a final-year <InlineCode>AI & Data Science</InlineCode> undergraduate on my way
      to becoming an <InlineCode>AI/ML Engineer</InlineCode> and{" "}
      <InlineCode>Data Scientist</InlineCode>. I build and ship machine learning models, NLP and
      computer vision pipelines, and data-driven products — and I'm equally passionate about{" "}
      <InlineCode>Full-Stack Development</InlineCode>, turning raw data and ideas into intelligent,
      end-to-end systems that learn, predict, and drive real decisions.
    </p>
  ),
};

const about = {
  label: "About",
  title: "About me",
  // NOTE: this string is used directly as the page's SEO/OG meta description
  // (see generateMetadata() in src/app/about/page.tsx). It must stay plain text —
  // Next.js will crash trying to serialize a JSX element into a <meta> tag.
  description: `Meet Thirumalai Nambi S, Aspiring AI/ML Engineer | Data Scientist | Full-Stack Developer | Final-Year AI & Data Science Undergraduate, from ${person.location}.`,
  // Rich/styled version shown on the page itself (JSX is fine here — it's rendered, not used as metadata).
  introHighlight: (
    <>
      Meet <span className="text-2xl font-bold text-brand">Thirumalai Nambi S</span>,{" "}
      <span className="text-lg text-muted ml-1">
        Aspiring AI/ML Engineer | Data Scientist | Full-Stack Developer | Final-Year AI & DS
        Undergrad
      </span>{" "}
      from {person.location}
    </>
  ),

  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://app.cal.com/bookings/upcoming",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Final-year B.Tech Artificial Intelligence undergraduate working toward a career as an{" "}
        <strong>AI/ML Engineer</strong> and <strong>Data Scientist</strong>, with hands-on
        internship experience applying Python, PySpark, and Scikit-learn to real-world predictive
        modeling and analytics problems. I build end-to-end ML pipelines — from data preprocessing
        and feature engineering to model training, evaluation, and deployment — with additional
        exposure to NLP, computer vision, and IoT-driven projects. Alongside AI and data, I'm
        equally passionate about <strong>full-stack development</strong>, building responsive,
        production-ready web applications with React, Next.js, and TypeScript. I'm driven by the
        challenge of turning raw, messy data and ambitious ideas into intelligent, working
        systems, and I'm actively seeking opportunities to apply and grow these skills on a
        full-time AI/ML, Data Science, or full-stack engineering team.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Experience Gained",
    experiences: [
      {
        company: "Zaalima Development Pvt. Ltd.",
        timeframe: "March 2026",
        role: "Data Science & Machine Learning Intern",
        achievements: [
          <>
            Worked on machine learning models and data-driven solutions in a remote, collaborative
            environment.
          </>,
          <>
            Assisted in building, evaluating, and optimizing ML models for real-world
            applications.
          </>,
          <>
            Developed practical experience in data handling, model performance evaluation, and
            project-based learning.
          </>,
        ],
        images: [],
        demoVideo: "https://youtu.be/5XZYDE6z5k4",
        projectSlug: "lexiscan-auto-legal-document-intelligence",
      },
      {
        company: "Edufyi Tech Solutions",
        timeframe: "December 2025",
        role: "Data Science Intern",
        achievements: [
          <>
            Completed a structured Data Science internship focusing on real-world datasets and
            analytical techniques.
          </>,
          <>
            Applied data preprocessing, visualization, and basic machine learning models to derive
            insights.
          </>,
          <>
            Gained hands-on experience in Python, data analysis libraries, and problem-solving
            methodologies.
          </>,
        ],
        images: [],
        demoVideo: "https://youtu.be/DzHFnk0_wjg",
        projectSlug: "building-once-ui-a-customizable-design-system",
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "St Peter's College of Engineering and Technology, Avadi, Chennai",
        description: (
          <>
            B.Tech in Artificial Intelligence and Data Science (Honours) · 2023 – 2027 · CGPA:
            8.3
          </>
        ),
      },
      {
        name: "Good Shepherd Matriculation Higher Secondary School",
        description: <>Completed HSSLC Grade with a percentage of 74.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Machine Learning & AI",
        icon: "brain",
        description: (
          <>
            Building and deploying predictive models and ML pipelines with Scikit-learn,
            TensorFlow, and Pandas — from feature engineering to evaluation.
          </>
        ),
      },
      {
        title: "Full-Stack Development",
        icon: "code",
        description: (
          <>
            Building responsive, production-ready web apps end to end with React, Next.js,
            TypeScript, and TailwindCSS.
          </>
        ),
      },
      {
        title: "Data Analytics & BI",
        icon: "chartBar",
        description: (
          <>
            Creating dynamic dashboards and interactive reports in Power BI to uncover insights,
            track KPIs, and support data-driven decisions.
          </>
        ),
      },
      {
        title: "Data Engineering",
        icon: "stack",
        description: (
          <>
            Wrangling and processing large-scale datasets with Python, SQL, and PySpark for
            reliable, analysis-ready pipelines.
          </>
        ),
      },
    ],
    // Grouped chip-style skills pulled directly from the resume's Skills section.
    categories: [
      {
        title: "Programming Languages",
        items: ["Python", "JavaScript", "SQL", "Java (Basic)"],
      },
      {
        title: "Web Technologies",
        items: ["HTML", "TailwindCSS", "TypeScript", "React", "Next.js"],
      },
      {
        title: "AI / ML Frameworks",
        items: ["Scikit-learn", "TensorFlow", "Pandas", "NumPy", "Streamlit"],
      },
      {
        title: "AI Agent Tools",
        items: ["Claude", "n8n", "Flow Wise", "Antigravity"],
      },
      {
        title: "Data & Big Data",
        items: ["Machine Learning", "NLP", "Computer Vision", "PySpark", "Hadoop"],
      },
      {
        title: "Tools & Platforms",
        items: ["Git", "GitHub", "Jupyter Notebook", "Google Colab", "Power BI", "Microsoft Office"],
      },
      {
        title: "Languages Spoken",
        items: ["English", "Tamil (Native)"],
      },
    ],
  },
  // Skills mapped to the actual repositories on my GitHub, so the stack behind
  // each build is easy to scan at a glance.
  repoSkills: {
    display: true,
    title: "Skills behind my repositories",
    description:
      "What each public repo on my GitHub actually uses — mapped from the codebase, not just the README.",
    repos: [
      {
        name: "Prepzi-AI",
        url: "https://github.com/Thirumalai-Nambi-S/Prepzi-AI",
        skills: ["TypeScript", "Next.js", "AI Agents", "Tailwind CSS"],
      },
      {
        name: "LexiScan-Auto",
        url: "https://github.com/Thirumalai-Nambi-S/LexiScan-Auto",
        skills: ["Python", "FastAPI", "spaCy", "Tesseract OCR", "BERT", "React"],
      },
      {
        name: "ChatBot (Silvy)",
        url: "https://github.com/Thirumalai-Nambi-S/ChatBot",
        skills: ["Google Gemini API", "JavaScript", "CSS", "HTML"],
      },
      {
        name: "SparkScale-Churn",
        url: "https://github.com/Thirumalai-Nambi-S/SparkScale-Churn",
        skills: ["PySpark", "Apache Spark MLlib", "Big Data ETL", "Python"],
      },
      {
        name: "customer_churn_prediction",
        url: "https://github.com/Thirumalai-Nambi-S/customer_churn_prediction",
        skills: ["Scikit-learn", "Pandas", "Jupyter Notebook", "EDA"],
      },
      {
        name: "Notes-Summarizer-AI",
        url: "https://github.com/Thirumalai-Nambi-S/Notes-Summarizer-AI",
        skills: ["Python", "NLP", "Streamlit", "Tokenization"],
      },
      {
        name: "weather_web",
        url: "https://github.com/Thirumalai-Nambi-S/weather_web",
        skills: ["JavaScript", "HTML", "CSS", "REST APIs"],
      },
      {
        name: "Thirumalai-Nambi-Portfolio",
        url: "https://github.com/Thirumalai-Nambi-S/Thirumalai-Nambi-Portfolio",
        skills: ["Next.js", "TypeScript", "Once UI", "Framer Motion"],
      },
      {
        name: "social-scheduler",
        url: "https://github.com/Thirumalai-Nambi-S/social-scheduler",
        skills: ["TypeScript", "Automation", "Scheduling APIs"],
      },
    ],
  },
};

const contact = {
  label: "Contact",
  title: "Let's build something great together",
  description: `Reach out to ${person.name} for collaborations, freelance work, or just to talk data and AI`,
  intro:
    "I'm always open to conversations about data analytics, AI-driven products, internships, or interesting freelance work. The fastest way to reach me is email — I usually reply within a day.",
  availability: "Open to internships, freelance data/AI projects, and full-time roles from 2027.",
  methods: [
    {
      label: "Email",
      value: person.email,
      href: `mailto:${person.email}`,
      icon: "email",
    },
    {
      label: "Phone",
      value: person.phone,
      href: "tel:+919962208939",
      icon: "phone",
    },
    {
      label: "Location",
      value: person.city,
      href: undefined,
      icon: "location",
    },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/Thirumalai-Nambi-S", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/thirumalai-nambi-s/",
      icon: "linkedin",
    },
    { label: "Hugging Face", href: "https://huggingface.co/Thirumalai-Nambi-S", icon: "hf" },
    {
      label: "Instagram",
      href: "https://www.instagram.com/_xthirux_/",
      icon: "instagram",
    },
  ],
};



const work = {
  label: "Work",
  title: "Internship & Freelance Work",
  description: `Internship roles and freelance collaborations by ${person.name}`,
  // Freelance engagements — add entries here as they come in.
  // Each item: { title, client, timeframe, description, link }
  /** @type {{ title: string; client?: string; timeframe?: string; description?: string; link?: string }[]} */
  freelance: [],
};

const project = {
  label: "Project",
  title: "Personal Projects",
  description: `Independent AI and data projects built by ${person.name}`,
  youtubeDemo: "https://youtu.be/5XZYDE6z5k4",
};

const githubRepos = {
  title: "More from my GitHub",
  description: "Smaller builds, experiments, and utilities from my repositories.",
  profile: "https://github.com/Thirumalai-Nambi-S",
  repos: [
    {
      name: "Prepzi-AI",
      description:
        "AI mock interview platform where users can attempt aptitude, technical, and HR interview rounds for free.",
      language: "TypeScript",
      languageColor: "#3178c6",
      stars: 1,
      license: "",
      updated: "Updated recently",
      url: "https://github.com/Thirumalai-Nambi-S/Prepzi-AI",
    },
    {
      name: "social-scheduler",
      description: "A scheduler for planning and queuing social media posts across platforms.",
      language: "TypeScript",
      languageColor: "#3178c6",
      stars: 0,
      license: "",
      updated: "Updated 2 weeks ago",
      url: "https://github.com/Thirumalai-Nambi-S/social-scheduler",
    },
    {
      name: "ChatBot",
      description:
        "Silvy — a conversational AI assistant powered by the Google Gemini API with a lightweight custom UI.",
      language: "CSS",
      languageColor: "#563d7c",
      stars: 2,
      license: "MIT",
      updated: "Updated last month",
      url: "https://github.com/Thirumalai-Nambi-S/ChatBot",
    },
    {
      name: "LexiScan-Auto",
      description:
        "OCR + NER pipeline that extracts structured clauses and entities from scanned legal PDFs.",
      language: "Python",
      languageColor: "#3572A5",
      stars: 0,
      license: "",
      updated: "Updated on May 20",
      url: "https://github.com/Thirumalai-Nambi-S/LexiScan-Auto",
    },
    {
      name: "SparkScale-Churn",
      description: "Telecom — Big Data Churn Prediction built with Apache Spark & PySpark MLlib.",
      language: "Python",
      languageColor: "#3572A5",
      stars: 0,
      license: "",
      updated: "Updated on Apr 21",
      url: "https://github.com/Thirumalai-Nambi-S/SparkScale-Churn",
    },
    {
      name: "customer_churn_prediction",
      description:
        "EDA and churn prediction with Logistic Regression & Random Forest on customer data.",
      language: "Jupyter Notebook",
      languageColor: "#DA5B0B",
      stars: 0,
      license: "",
      updated: "Updated on Apr 17",
      url: "https://github.com/Thirumalai-Nambi-S/customer_churn_prediction",
    },
    {
      name: "weather_web",
      description: "A weather lookup web app built with vanilla JavaScript, HTML, and CSS.",
      language: "JavaScript",
      languageColor: "#f1e05a",
      stars: 2,
      license: "MIT",
      updated: "Updated on Dec 25, 2025",
      url: "https://github.com/Thirumalai-Nambi-S/weather_web",
    },
    {
      name: "Thirumalai-Nambi-Portfolio",
      description: "The source for this personal portfolio, built with Once UI and Next.js.",
      language: "TypeScript",
      languageColor: "#3178c6",
      stars: 2,
      license: "Other",
      updated: "Updated on Jul 14, 2025",
      url: "https://github.com/Thirumalai-Nambi-S/Thirumalai-Nambi-Portfolio",
    },
    {
      name: "Notes-Summarizer-AI",
      description:
        "NLP-based summarization tool supporting PDF, text, audio, and YouTube inputs, built with Streamlit.",
      language: "Python",
      languageColor: "#3572A5",
      stars: 2,
      license: "MIT",
      updated: "Updated on Jul 9, 2025",
      url: "https://github.com/Thirumalai-Nambi-S/Notes-Summarizer-AI",
    },
  ],
};


const gallery = {
  label: "Achievements",
  title: "Achievements & certificates",
  description: `Certificates and milestones collected by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/image-01.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-03.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-06.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-08.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-11.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-15.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-16.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/image-17.jpg",
      alt: "image",
      orientation: "vertical"
    },
    {
      src: "/images/gallery/image-18.jpg",
      alt: "image",
      orientation: "vertical"
    },
    {
      src: "/images/gallery/image-19.jpg",
      alt: "image",
      orientation: "horizontal"
    },
    {
      src: "/images/gallery/image-20.jpg",
      alt: "image",
      orientation: "vertical"
    },
    {
      src: "/images/gallery/image-21.jpg",
      alt: "image",
      orientation: "vertical"
    },
    {
      src: "/images/gallery/image-22.jpg",
      alt: "image",
      orientation: "vertical"
    },
    {
      src: "/images/gallery/image-23.jpg",
      alt: "image",
      orientation: "vertical"
    },
  ],
};

export { person, social, newsletter, home, about, contact, work, project, githubRepos, gallery };
