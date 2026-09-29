import { useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, ExternalLink, GraduationCap, Code2, Download, Send, Award, CheckCircle2, X, Sparkles, BookOpen, Layers, Cpu, Database, Layout, Terminal, Server, FileText, Check, Eye, UserCheck, ShieldCheck, Globe, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export function About({profile}){
  return (
    <section className="section about-section" id="about">
      <div className="section-kicker"><span>01</span></div>
      <div className="about-grid">
        <div>
          <h2 className="section-title">About Me</h2>
          <div className="about-highlights">
            <div className="about-stat-card">
              <span className="about-stat-num">3rd Year</span>
              <span className="about-stat-lbl">B.Tech CSE Undergrad</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-num">3+ Live</span>
              <span className="about-stat-lbl">Production Projects</span>
            </div>
            <div className="about-stat-card">
              <span className="about-stat-num">5+ Certs</span>
              <span className="about-stat-lbl">Govt &amp; Industry Credentials</span>
            </div>
          </div>
        </div>

        <div className="about-copy">
          <p className="about-lead">
            I’m <strong>{(profile?.name||'Amit Kumar').replace(/\s+Sharma\b/i,'')}</strong>, a Computer Science Engineering student based in {profile?.location||'Bihar, India'}. I specialize in building practical, high-impact web applications, robust backends, and applied AI/ML systems.
          </p>
          <p>
            From engineering real-time emergency healthcare networks (<strong>Life Saver</strong>) to deep learning crop diagnosis (<strong>PlantCare AI</strong>) and automated civic ticket routing, I love crafting software that solves tangible real-world problems.
          </p>
          
          <div className="about-focus-grid">
            <div className="focus-item">
              <Code2 size={18}/>
              <div>
                <strong>Full Stack Development</strong>
                <small>React, Node.js, Express, MongoDB, REST APIs</small>
              </div>
            </div>
            <div className="focus-item">
              <Cpu size={18}/>
              <div>
                <strong>Applied AI &amp; Machine Learning</strong>
                <small>TensorFlow, MobileNetV2, Computer Vision, NLP</small>
              </div>
            </div>
            <div className="focus-item">
              <Terminal size={18}/>
              <div>
                <strong>Core Problem Solving</strong>
                <small>Data Structures, Algorithms in Java, OOP &amp; DBMS</small>
              </div>
            </div>
          </div>

          <div className="about-tags">
            <span>Full Stack MERN</span>
            <span>AI / Deep Learning</span>
            <span>DSA in Java</span>
            <span>Cloud &amp; Docker</span>
            <span>Clean Architecture</span>
          </div>
        </div>
      </div>

      <div className="about-note">
        <Code2/>
        <span>Currently building production software, learning continuously, and seeking software engineering roles.</span>
        <span className="note-location">BASED IN {profile?.location||'BIHAR, INDIA'}</span>
      </div>
    </section>
  );
}

export function Education({items=[]}){
  const [selectedMarksheet, setSelectedMarksheet] = useState(null);

  const educationData = [
    {
      institution: 'Jai Narain College of Technology (LNCT Group)',
      degree: 'B.Tech',
      field: 'Computer Science Engineering',
      startYear: '2022',
      endYear: '2026',
      status: '3rd Year Ongoing',
      description: 'Core focus on Algorithms, Distributed Systems, Web Application Engineering, Machine Learning, and Database Architecture.',
      marksheet: null
    },
    {
      institution: 'Bhartiya Inter College, Gahiri, West Champaran',
      board: 'Bihar School Examination Board (BSEB), Patna',
      degree: 'Higher Secondary (12th)',
      field: 'Science (PCM + Biology)',
      startYear: '2021',
      endYear: '2023',
      examYear: '2023',
      rollCode: '35017',
      rollNo: '23010107',
      regNo: 'R-350170111-21',
      fatherName: 'Saroj Sharma',
      motherName: 'Anita Devi',
      aggregate: '272 / 500',
      division: '2nd Division',
      description: 'Completed Intermediate Science curriculum with strong foundations in Physics, Chemistry, Mathematics, and Hindi (75 Distinction).',
      marksheet: {
        title: 'Intermediate Annual Examination, 2023 Marks Statement',
        board: 'Bihar School Examination Board, Patna',
        bsebId: '2211380170480',
        serialNo: '0641557',
        msNo: '1223510101',
        issueDate: '21/03/2023',
        subjects: [
          { name: 'English (Compulsory)', total: 100, pass: 30, theory: 50, practical: '-', marks: 50 },
          { name: 'Hindi (Compulsory)', total: 100, pass: 30, theory: 75, practical: '-', marks: '75 (D)' },
          { name: 'Physics (Elective)', total: 100, pass: 33, theory: 31, practical: 29, marks: 60 },
          { name: 'Chemistry (Elective)', total: 100, pass: 33, theory: 23, practical: 28, marks: 51 },
          { name: 'Mathematics (Elective)', total: 100, pass: 30, theory: 36, practical: '-', marks: 36 },
          { name: 'Biology (Additional)', total: 100, pass: 33, theory: 18, practical: 28, marks: 46 }
        ],
        aggregate: '272 / 500',
        result: '2nd Division'
      }
    },
    {
      institution: 'Raj High School Bettiah, West Champaran',
      board: 'Bihar School Examination Board (BSEB), Patna',
      degree: 'Secondary School Examination (10th)',
      field: 'General Science & Mathematics',
      endYear: '2021',
      examYear: '2021',
      rollCode: '54001',
      rollNo: '2100133',
      regNo: '54001-00299-20',
      fatherName: 'Saroj Sharma',
      motherName: 'Anita Devi',
      aggregate: '317 / 500 (63.4%)',
      division: '1st Division (First Div.)',
      description: 'Graduated with 1st Division honors with top scores in Science (78/100), Social Science (64/100), and Mathematics (59/100).',
      marksheet: {
        title: 'Secondary School Examination, 2021 Mark Sheet',
        board: 'Bihar School Examination Board, Patna',
        serialNo: '0513662',
        slNo: '540000132',
        dob: '10/02/2005',
        issueDate: '05/04/2021',
        subjects: [
          { name: 'M.I.L. Hindi', total: 100, pass: 30, theory: 58, internal: '-', marks: 58, inWords: 'FIVE EIGHT' },
          { name: 'S.I.L. Sanskrit', total: 100, pass: 30, theory: 58, internal: '-', marks: 58, inWords: 'FIVE EIGHT' },
          { name: 'Mathematics', total: 100, pass: 30, theory: 59, internal: '-', marks: 59, inWords: 'FIVE NINE' },
          { name: 'Science', total: 100, pass: 30, theory: 58, internal: 20, marks: 78, inWords: 'SEVEN EIGHT' },
          { name: 'Social Science', total: 100, pass: 30, theory: 44, internal: 20, marks: 64, inWords: 'SIX FOUR' },
          { name: 'English', total: 100, pass: 30, theory: 40, internal: '-', marks: 40, inWords: 'FOUR ZERO' }
        ],
        aggregate: '317 / 500',
        result: '1st Division (First Div.)'
      }
    }
  ];

  return (
    <section className="section education-section" id="education">
      <div className="section-kicker"><span>02</span></div>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Education &amp; Academic Credentials</h2>
          <p>Verified academic foundations, board examinations, and degree coursework.</p>
        </div>
      </div>
      <div className="education-list">
        {educationData.map((item, i)=>(
          <article className="education-item" key={item.institution + i}>
            <div className="edu-year">
              <span>{item.startYear ? `${item.startYear} — ${item.endYear}` : item.endYear}</span>
              {item.division && <span className="edu-div-badge">{item.division}</span>}
            </div>
            <div className="edu-marker"><GraduationCap size={22}/></div>
            <div className="edu-body">
              <div className="edu-title-row">
                <h3>{item.degree}{item.field ? ` — ${item.field}` : ''}</h3>
                {item.aggregate && <span className="edu-aggregate">Score: <strong>{item.aggregate}</strong></span>}
              </div>
              <p className="edu-inst-name">{item.institution}</p>
              {item.board && <small className="edu-board-tag">{item.board}</small>}
              <p className="edu-desc-text">{item.description}</p>
              {item.marksheet && (
                <button 
                  type="button" 
                  className="marksheet-btn"
                  onClick={() => setSelectedMarksheet(item)}
                >
                  <Eye size={15}/> View Official Marksheet
                </button>
              )}
            </div>
            <span className="edu-index">0{i+1}</span>
          </article>
        ))}
      </div>

      {/* Marksheet Details Modal */}
      {selectedMarksheet && selectedMarksheet.marksheet && (
        <div className="modal-backdrop" onClick={() => setSelectedMarksheet(null)}>
          <div className="marksheet-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMarksheet(null)} aria-label="Close marksheet">
              <X size={20}/>
            </button>
            <div className="marksheet-paper">
              <div className="marksheet-header">
                <div className="bseb-emblem">BSEB</div>
                <div className="bseb-title">
                  <h2>{selectedMarksheet.marksheet.board}</h2>
                  <h3>{selectedMarksheet.marksheet.title}</h3>
                  <div className="bseb-meta-chips">
                    <span>Year: {selectedMarksheet.examYear}</span>
                    <span>Serial: {selectedMarksheet.marksheet.serialNo}</span>
                    <span>Roll Code: {selectedMarksheet.rollCode}</span>
                    <span>Roll No: {selectedMarksheet.rollNo}</span>
                  </div>
                </div>
              </div>

              <div className="student-info-grid">
                <div><strong>Candidate Name:</strong> Amit Kumar</div>
                <div><strong>Mother's Name:</strong> {selectedMarksheet.motherName}</div>
                <div><strong>Father's Name:</strong> {selectedMarksheet.fatherName}</div>
                <div><strong>School / College:</strong> {selectedMarksheet.institution}</div>
                <div><strong>Registration No:</strong> {selectedMarksheet.regNo}</div>
                {selectedMarksheet.marksheet.dob && <div><strong>Date of Birth:</strong> {selectedMarksheet.marksheet.dob}</div>}
              </div>

              <div className="marks-table-wrap">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Subject Name</th>
                      <th>Full Marks</th>
                      <th>Pass Marks</th>
                      <th>Theory</th>
                      <th>Practical / Internal</th>
                      <th>Total Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMarksheet.marksheet.subjects.map((sub, idx) => (
                      <tr key={idx}>
                        <td><strong>{sub.name}</strong></td>
                        <td>{sub.total}</td>
                        <td>{sub.pass}</td>
                        <td>{sub.theory}</td>
                        <td>{sub.practical || sub.internal || '-'}</td>
                        <td className="mark-total">{sub.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5"><strong>AGGREGATE TOTAL &amp; RESULT:</strong></td>
                      <td className="aggregate-score">
                        <strong>{selectedMarksheet.marksheet.aggregate}</strong>
                        <span className="result-pill">{selectedMarksheet.marksheet.result}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="marksheet-footer">
                <div>
                  <small>Date of Issue: {selectedMarksheet.marksheet.issueDate}</small>
                  <small>Verified Academic Document</small>
                </div>
                <div className="verified-seal">
                  <CheckCircle2 size={16}/> BSEB Verified
                </div>
              </div>
            </div>

            <div className="modal-actions mt-4">
              <button className="button button-primary" onClick={() => setSelectedMarksheet(null)}>
                Close Marksheet
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Comprehensive descriptions (2-5 lines) for all technologies
const techDetails = {
  'Java': {
    category: 'Programming',
    icon: Terminal,
    tagline: 'Enterprise-grade Object-Oriented Programming',
    description: 'A versatile, strongly typed object-oriented language that I use for building reliable backend services and mastering complex data structures and algorithmic problem solving. Its strong typing and JVM ecosystem provide deep insight into memory management and OOP design patterns.'
  },
  'JavaScript': {
    category: 'Programming / Web',
    icon: Terminal,
    tagline: 'Modern Dynamic Web Engine (ES6+)',
    description: 'The core language of modern web applications. I utilize ES6+ features, asynchronous async/await patterns, and event-driven architecture to build reactive frontend interfaces and scalable server-side microservices across the entire full-stack ecosystem.'
  },
  'Python': {
    category: 'Programming / AI',
    icon: Terminal,
    tagline: 'Data Science, Machine Learning & Automation',
    description: 'My primary choice for machine learning model development, AI experiments, data preprocessing, and rapid prototyping. I use Python with TensorFlow, NumPy, and Pandas to implement computer vision and deep learning pipelines efficiently.'
  },
  'C / C++': {
    category: 'Programming',
    icon: Terminal,
    tagline: 'High Performance & Systems Foundations',
    description: 'Foundational languages providing direct control over memory allocation and system-level computing. Essential for competitive programming, understanding low-level data structures, and writing computationally fast algorithms.'
  },
  'HTML': {
    category: 'Frontend',
    icon: Layout,
    tagline: 'Semantic Web Structure & Accessibility',
    description: 'The backbone of all web projects. I emphasize semantic HTML5 tags to ensure optimal SEO ranking, screen reader accessibility, fast load times, and structured content organization across modern devices.'
  },
  'CSS': {
    category: 'Frontend',
    icon: Layout,
    tagline: 'Modern Responsive Layouts & Micro-Animations',
    description: 'Deep knowledge of modern CSS, including Flexbox, CSS Grid, custom properties (CSS variables), keyframe animations, and glassmorphism. Used to craft fluid, visually stunning, dark-themed responsive UI designs.'
  },
  'React.js': {
    category: 'Frontend',
    icon: Layout,
    tagline: 'Component-Based SPA & UI State Management',
    description: 'My primary UI library for crafting dynamic Single Page Applications. I specialize in custom React Hooks, context API, state optimization, component reusability, and seamless REST API data hydration.'
  },
  'Next.js': {
    category: 'Frontend',
    icon: Layout,
    tagline: 'Server-Side Rendering & Production Web Framework',
    description: 'Full-stack React framework providing hybrid static and server-rendered pages, API routes, automated routing, and built-in image/font optimizations for blazing fast enterprise web applications.'
  },
  'Tailwind CSS': {
    category: 'Frontend',
    icon: Layout,
    tagline: 'Utility-First Modern Styling Engine',
    description: 'A rapid UI development framework that helps maintain consistent design systems, color tokens, and responsive breakpoints directly within JSX components without bloating stylesheets.'
  },
  'Node.js': {
    category: 'Backend',
    icon: Server,
    tagline: 'Asynchronous Non-Blocking Backend Runtime',
    description: 'A high-throughput JavaScript runtime built on Chrome’s V8 engine. Used to engineer lightweight, event-driven REST APIs, handle concurrent connections, and execute real-time communication via WebSockets.'
  },
  'Express.js': {
    category: 'Backend',
    icon: Server,
    tagline: 'Fast, Minimalist Web Framework for Node.js',
    description: 'My preferred framework for constructing clean RESTful APIs, modular routing pipelines, custom middleware (authentication, CORS, rate-limiting, error handling), and database integration.'
  },
  'REST APIs': {
    category: 'Backend / Architecture',
    icon: Server,
    tagline: 'Stateless Standard Client-Server Communication',
    description: 'Designing and integrating industry-standard RESTful endpoints with consistent JSON payloads, HTTP status codes, query pagination, and robust error responses for seamless frontend-backend decoupling.'
  },
  'MongoDB': {
    category: 'Database',
    icon: Database,
    tagline: 'Flexible NoSQL Document Database',
    description: 'A high-performance document database where I model flexible JSON schemas with Mongoose, build aggregation pipelines, manage indexes for fast search, and store scalable application data.'
  },
  'SQL': {
    category: 'Database',
    icon: Database,
    tagline: 'Relational Database Management & Query Optimization',
    description: 'Relational database querying across MySQL and PostgreSQL. I design normalized schemas with primary/foreign key constraints, write complex joins, and ensure ACID transaction integrity for sensitive data.'
  },
  'Machine learning fundamentals': {
    category: 'AI / ML',
    icon: Cpu,
    tagline: 'Core Predictive Modeling & Mathematical Algorithms',
    description: 'Foundational expertise in supervised and unsupervised learning algorithms, regression, classification, cross-validation, feature scaling, and performance metrics (Precision, Recall, F1-Score, ROC-AUC).'
  },
  'Transfer learning': {
    category: 'AI / ML',
    icon: Cpu,
    tagline: 'Fine-Tuning Pretrained Neural Networks',
    description: 'Leveraging cutting-edge pretrained vision models (MobileNetV2, ResNet50) and fine-tuning them on domain-specific datasets (like crop disease identification) to achieve high accuracy with reduced training overhead.'
  },
  'Git': {
    category: 'Tools & DevOps',
    icon: Code2,
    tagline: 'Distributed Version Control & History Tracking',
    description: 'Essential tool for tracking source code changes, branch strategies (GitFlow), rebasing, resolving merge conflicts, and maintaining clean, traceable commit histories across projects.'
  },
  'GitHub': {
    category: 'Tools & DevOps',
    icon: Github,
    tagline: 'Cloud Collaboration & CI/CD Workflows',
    description: 'Hosting open-source repositories, collaborating via pull requests and code reviews, managing project issue boards, and setting up GitHub Actions for automated deployment workflows.'
  },
  'Docker': {
    category: 'Tools & DevOps',
    icon: Layers,
    tagline: 'Containerization & Environment Isolation',
    description: 'Packaging full-stack applications with Dockerfiles and docker-compose to ensure consistent, bug-free execution across local development and production cloud deployment environments.'
  },
  'Data Structures and Algorithms': {
    category: 'Core CS',
    icon: Cpu,
    tagline: 'Efficient Computational Problem Solving',
    description: 'Core computer science foundations including arrays, linked lists, stacks, queues, trees, graphs, dynamic programming, and binary search. Focuses on writing code with optimal time and space complexity.'
  },
  'OOP': {
    category: 'Core CS',
    icon: Layers,
    tagline: 'Object-Oriented Design & Clean Architecture',
    description: 'Mastery of encapsulation, inheritance, polymorphism, and abstraction. Applied to structure modular, testable, and maintainable software systems adhering to SOLID principles.'
  },
  'DBMS': {
    category: 'Core CS',
    icon: Database,
    tagline: 'Database Management Systems & Transactions',
    description: 'Deep theoretical and practical knowledge of relational algebra, B-Trees indexing, normalization (1NF to BCNF), concurrency control, deadlocks, and ACID transaction guarantees.'
  },
  'Computer Networks': {
    category: 'Core CS',
    icon: Server,
    tagline: 'Network Protocols & Web Communication',
    description: 'Understanding of the OSI and TCP/IP models, HTTP/HTTPS protocols, TCP handshakes, DNS resolution, IP routing, subnetting, WebSockets, and network security foundations.'
  },
  'Operating Systems': {
    category: 'Core CS',
    icon: Terminal,
    tagline: 'Process Scheduling, Concurrency & Memory Management',
    description: 'Core OS concepts including process management, CPU scheduling algorithms, multithreading, synchronization primitives (mutex, semaphores), virtual memory, and file system architecture.'
  }
};

export function Skills({items=[]}){
  const defaultGroups = {
    'Programming': ['Java', 'JavaScript', 'Python', 'C / C++'],
    'Frontend': ['HTML', 'CSS', 'React.js', 'Next.js', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Express.js', 'REST APIs'],
    'Database': ['MongoDB', 'SQL'],
    'AI / ML': ['Machine learning fundamentals', 'Transfer learning'],
    'Tools': ['Git', 'GitHub', 'Docker', 'REST APIs'],
    'Core': ['Data Structures and Algorithms', 'OOP', 'DBMS', 'Computer Networks', 'Operating Systems']
  };

  const groups = items?.length
    ? items.reduce((a,s)=>{ (a[s.category||'Skills']??=[]).push(s); return a; }, {})
    : defaultGroups;

  const [activeTech, setActiveTech] = useState(null);

  const getTechInfo = (techName) => {
    if (techDetails[techName]) return techDetails[techName];
    const key = Object.keys(techDetails).find(k => k.toLowerCase() === techName.toLowerCase());
    if (key) return techDetails[key];
    return {
      category: 'Software Engineering',
      tagline: 'Applied Technology & Engineering Practice',
      description: `${techName} is an integral part of my software engineering stack, applied practically in developing performant applications, clean architectures, and solving real-world challenges.`
    };
  };

  const activeInfo = activeTech ? getTechInfo(activeTech) : null;
  const ActiveIcon = activeInfo?.icon || Code2;

  return (
    <section className="section skills-section" id="skills">
      <div className="section-kicker"><span>03</span></div>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <p>A growing toolkit, grouped by domain. Click any skill badge to view its practical role.</p>
        </div>
      </div>

      {/* Centered Modal Popover when a tech is clicked */}
      {activeTech && activeInfo && (
        <div className="modal-backdrop" onClick={() => setActiveTech(null)}>
          <div className="skill-center-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveTech(null)} aria-label="Close tech info">
              <X size={20}/>
            </button>
            <div className="skill-center-header">
              <div className="skill-center-icon">
                <ActiveIcon size={28}/>
              </div>
              <div>
                <span className="skill-center-category">{activeInfo.category}</span>
                <h3>{activeTech}</h3>
                <p className="skill-center-tagline">{activeInfo.tagline}</p>
              </div>
            </div>
            <div className="skill-center-body">
              <h4>Engineering Application &amp; Role:</h4>
              <p>{activeInfo.description}</p>
            </div>
            <div className="modal-actions">
              <button className="button button-primary" onClick={() => setActiveTech(null)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Grid of Skill Groups */}
      <div className="skills-grid">
        {Object.entries(groups).map(([group, values]) => (
          <article className="skill-group" key={group}>
            <div className="skill-group-header">
              <h3>{group}</h3>
              <span className="skill-count">{values.length} Skills</span>
            </div>
            <p className="skill-group-hint">Click any badge for 2-5 line summary</p>
            <div className="skill-tags">
              {values.map((v, i) => {
                const name = typeof v === 'string' ? v : v.name;
                const isSelected = activeTech === name;
                return (
                  <button
                    type="button"
                    className={`skill-tag-btn ${isSelected ? 'skill-tag-active' : ''}`}
                    key={v._id || name || i}
                    onClick={() => setActiveTech(name)}
                  >
                    <Sparkles size={11} className="tag-sparkle"/>
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const LeetCodeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.816 3.655 5.99 5.99 0 0 0 2.936-.343 5.955 5.955 0 0 0 1.954-1.248l4.475-4.484a1.371 1.371 0 0 0 .041-1.938 1.376 1.376 0 0 0-1.942-.04l-4.47 4.482a3.212 3.212 0 0 1-1.055.673 3.253 3.253 0 0 1-1.595.186 3.219 3.219 0 0 1-2.614-1.983 3.167 3.167 0 0 1-.189-.553 3.22 3.22 0 0 1-.034-1.282 3.15 3.15 0 0 1 .658-1.144L8.746 8.52l4.737-5.076a1.374 1.374 0 0 0-1-2.444zM16.48 7.35a1.37 1.37 0 0 0-1.37 1.372v6.556a1.37 1.37 0 0 0 2.74 0V8.722a1.37 1.37 0 0 0-1.37-1.372zm3.85 3.51a1.37 1.37 0 0 0-1.37 1.372v3.044a1.37 1.37 0 0 0 2.74 0v-3.044a1.37 1.37 0 0 0-1.37-1.372z"/>
  </svg>
);

const defaultProjects = [
  {
    title: 'PlantCare AI',
    slug: 'plantcare-ai',
    category: 'AI / MACHINE LEARNING',
    description: 'An AI-powered agricultural disease detection system utilizing MobileNetV2 deep learning architectures to identify crop health from leaf images and prescribe actionable treatments.',
    technologies: ['Python', 'TensorFlow', 'Keras', 'MobileNetV2', 'Flask', 'React', 'Vercel'],
    status: 'Live & Active',
    githubUrl: 'https://github.com/kumaramitbth2005-spec',
    liveUrl: 'https://plant-care-ai-fawn.vercel.app'
  },
  {
    title: "Triage the City's Complaint Queue",
    slug: 'city-complaint-triage',
    category: 'FULL STACK & AI',
    description: 'An operator-focused municipal grievance management portal that automates ticket categorization, urgency scoring, and department routing using NLP and full-stack APIs.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'AI NLP', 'REST API'],
    status: 'Featured Project',
    githubUrl: 'https://github.com/kumaramitbth2005-spec',
    liveUrl: 'https://triage-the-city-s-complaint-queue.vercel.app'
  },
  {
    title: 'Life Saver',
    slug: 'life-saver',
    category: 'FULL STACK & HEALTHCARE',
    description: 'A critical emergency healthcare & live blood donation coordination platform connecting patients with verified nearby donors and hospitals through real-time geolocation matching and alert notifications.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Geolocation API', 'REST API'],
    status: 'Live & Production',
    githubUrl: 'https://github.com/kumaramitbth2005-spec',
    liveUrl: 'https://life-sever.vercel.app'
  }
];

const projectPath = p => `/projects/${p.slug||p._id||String(p.title||'project').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`;

export function Projects({items=[]}){
  const projectsList = items?.length ? items : defaultProjects;

  return (
    <section className="section projects-section" id="projects">
      <div className="section-kicker"><span>04</span></div>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Featured Projects</h2>
          <p>Practical software, healthcare systems, and AI applications engineered for impact.</p>
        </div>
        <a href="#hire" className="text-link">Have a project in mind? <ArrowUpRight size={16}/></a>
      </div>
      <div className="projects-grid">
        {projectsList.map((p,i)=>(
          <article className={`project-card project-${i%3}`} key={p._id||p.slug||p.title}>
            <div className="project-art">
              <div className="project-art-grid"/>
              <span className="project-number">0{i+1}</span>
              <div className="project-art-icon">{i===0?'✳':i===1?'⌘':'↗'}</div>
              <span className="project-art-type">{p.category||'PROJECT'}</span>
            </div>
            <div className="project-meta">
              <span>{p.category||'PROJECT'}</span>
              <span className="project-status-badge">{p.status||'Active'}</span>
            </div>
            <h3><Link to={projectPath(p)}>{p.title}</Link></h3>
            <p>{p.description}</p>
            <div className="project-stack">
              {(p.technologies||[]).map(t=><span key={t}>{t}</span>)}
            </div>
            <div className="project-links">
              <Link to={projectPath(p)} className="project-detail-link">Project details <ArrowUpRight size={15}/></Link>
              <div className="project-ext-links">
                {p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noreferrer" title="GitHub Repository"><Github size={15}/> <span>Code</span></a>}
                {p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noreferrer" className="live-link" title="Live Preview"><ExternalLink size={15}/> <span>Live</span></a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Resume({resume}){
  const fallbackUrl = resume?.resumeUrl;
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  const viewUrl = `${apiUrl}/resume/pdf`;
  const downloadUrl = `${apiUrl}/resume/pdf?download=true`;
  
  return (
    <section className="section resume-section" id="resume">
      <div className="resume-panel">
        <div className="resume-symbol">CV<span>↗</span></div>
        <div>
          <div className="section-kicker"><span>05</span></div>
          <h2 className="section-title">Resume</h2>
          <p>A concise overview of my academic foundation, software projects, and technical proficiencies.</p>
        </div>
        <div className="resume-actions">
          <a className="button button-primary" href={downloadUrl} target="_blank" rel="noreferrer"><Download size={16}/> Download CV</a>
          <a className="button button-secondary" href={viewUrl} target="_blank" rel="noreferrer">View resume <ArrowUpRight size={16}/></a>
          {fallbackUrl && (
            <a className="button button-secondary" style={{marginLeft: '10px'}} href={fallbackUrl} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Alternate Link</a>
          )}
        </div>
      </div>
    </section>
  );
}

// Social media list matching Image 3 with specific app hover styles
export function Socials({items=[]}){
  const defaultSocials = [
    { 
      platform: 'Instagram', 
      url: 'https://instagram.com/', 
      handle: '@officialamit_sharma5686',
      appColor: '#E1306C',
      appClass: 'social-instagram'
    },
    { 
      platform: 'Facebook', 
      url: 'https://facebook.com/', 
      handle: 'facebook.com/Amit Kumar Sharma',
      appColor: '#1877F2',
      appClass: 'social-facebook'
    },
    { 
      platform: 'Twitter / X', 
      url: 'https://x.com/', 
      handle: '@amitkumar_dev',
      appColor: '#1DA1F2',
      appClass: 'social-twitter'
    },
    { 
      platform: 'GitHub', 
      url: 'https://github.com/kumaramitbth2005-spec', 
      handle: 'github.com/kumaramitbth2005-spec/Portfolio',
      appColor: '#8957e5',
      appClass: 'social-github'
    },
    { 
      platform: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/amit-kumar-814263335', 
      handle: 'linkedin.com/in/amit-kumar-814263335',
      appColor: '#0A66C2',
      appClass: 'social-linkedin'
    },
    { 
      platform: 'LeetCode', 
      url: 'https://leetcode.com/u/AmitKumar_83/', 
      handle: 'leetcode.com/AmitKumar_83',
      appColor: '#FFA116',
      appClass: 'social-leetcode'
    }
  ];

  const listItems = items.filter(s=>s.url).length ? items.filter(s=>s.url) : defaultSocials;
  
  const getIcon = (platform) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('instagram')) return Instagram;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('twitter') || p.includes('x')) return Twitter;
    if (p.includes('github')) return Github;
    if (p.includes('linkedin')) return Linkedin;
    if (p.includes('leetcode')) return LeetCodeIcon;
    if (p.includes('mail') || p.includes('email')) return Mail;
    return ExternalLink;
  };

  const getAppClass = (platform) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('instagram')) return 'social-instagram';
    if (p.includes('facebook')) return 'social-facebook';
    if (p.includes('twitter') || p.includes('x')) return 'social-twitter';
    if (p.includes('github')) return 'social-github';
    if (p.includes('linkedin')) return 'social-linkedin';
    if (p.includes('leetcode')) return 'social-leetcode';
    return '';
  };

  return (
    <section className="section socials-section" id="social">
      <div className="section-kicker"><span>06</span></div>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Connect &amp; Social Profiles</h2>
          <p>Connect with me across developer networks, problem solving platforms, and social channels.</p>
        </div>
      </div>
      <div className="social-app-grid">
        {listItems.map((s, idx)=>{
          const Icon = getIcon(s.platform);
          const appClass = s.appClass || getAppClass(s.platform);
          return (
            <a 
              className={`social-app-card ${appClass}`} 
              href={s.url} 
              key={s._id || s.platform || idx} 
              target="_blank" 
              rel="noreferrer"
            >
              <div className="social-app-icon-wrap">
                <Icon size={28}/>
              </div>
              <h3 className="social-app-name">{s.platform}</h3>
              <p className="social-app-handle">{s.handle || s.url}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function Certificates({items=[]}){
  const defaultCerts = [
    {
      title: 'Experiential Learning: Solution Development in IT (NSQF Level 5)',
      issuer: 'FutureSkills Prime · NASSCOM · Ministry of Electronics & IT (MeitY), Govt. of India',
      college: 'LNCT Group Of College',
      courseName: 'Experiential Learning',
      nos: '(SSC/N8149) Essentials of solution development in IT, NSQF Level 5',
      issueDate: '17-03-2025',
      credentialId: 'FSP/2026/1703/9088',
      signatory: 'Dr. Abhilasha Gaur (CEO, IT-ITeS Sector Skills Council, NASSCOM)',
      category: 'IT & Solution Development',
      description: 'Certified by Ministry of Electronics & Information Technology (MeitY) and NASSCOM for completing course on Experiential Learning aligned to NOS Essentials of solution development in IT at NSQF Level 5.',
      verificationUrl: 'https://futureskillsprime.in/'
    },
    {
      title: 'Introduction to Modern AI',
      issuer: 'Cisco Networking Academy',
      college: 'LNCT Group of College (through Cisco Networking Academy program)',
      instructor: 'Rakeshwari Agrawal',
      issueDate: '04 Jun 2026',
      credentialId: 'e81c4d07-caf9-47bb-ba79-7d61d1a334de',
      category: 'Artificial Intelligence',
      description: 'Awarded by Cisco Networking Academy through LNCT Group of Colleges for demonstrating practical mastery in Modern Artificial Intelligence concepts, algorithms, and applications.',
      verificationUrl: 'https://www.netacad.com/'
    },
    {
      title: 'Experiential Learning Project: Plant Care AI',
      issuer: 'FutureSkills Prime · NASSCOM · MeitY',
      college: 'LNCT Group Of College',
      projectTitle: 'Project: Plant Care AI',
      issueDate: '17-03-2025',
      credentialId: 'FSP/2026/1703/9088',
      category: 'AI Project Track',
      description: 'Project-based practical credential awarded for engineering and developing the Plant Care AI solution development project under the NASSCOM FutureSkills experiential program.',
      verificationUrl: 'https://futureskillsprime.in/'
    },
    {
      title: 'Placement Preparation Technical Workshop',
      issuer: 'GeeksforGeeks',
      signatory: 'Mr. Sandeep Jain (Founder & CEO, GeeksforGeeks)',
      issueDate: '2024',
      credentialId: 'GFG-PP-1745649812',
      category: 'DSA & Problem Solving',
      description: 'Successfully completed the intensive technical workshop on Placement Preparation conducted by GeeksforGeeks covering core algorithms, system problem solving, and technical interviews.',
      verificationUrl: 'https://media.geeksforgeeks.org/certificates/1745649812/d0516e9d3a5f71393e99cab2bcac3890.pdf'
    },
    {
      title: 'Java Full Stack Developer Virtual Internship (10 Weeks)',
      issuer: 'AICTE · EduSkills · National Internship Portal (Ministry of Education, Govt. of India)',
      college: 'Jai Narain College of Technology',
      duration: '10 Weeks (Oct - Dec 2024)',
      credentialId: '87c4b35f19ab1733b5602b25b4dc8654',
      studentId: 'STU6597f32728f1d1704456999',
      grade: 'C',
      signatories: 'Shri Buddha Chandrasekhar (CCO, NEAT Cell, AICTE) & Dr. Satya Ranjan Biswal (CTO, EduSkills)',
      category: 'Full Stack Engineering',
      description: 'Completed 10 weeks virtual internship on Java Full Stack Development supported by EduSkills Academy and AICTE (Ministry of Education, Govt. of India). Grade: C.',
      verificationUrl: 'https://internship.aicte-india.org/'
    }
  ];

  const certList = items.length ? items : defaultCerts;
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="section certificates-section" id="certificate">
      <div className="section-kicker"><span>07</span></div>
      <div className="section-heading">
        <div>
          <h2 className="section-title">Certifications &amp; Verified Credentials</h2>
          <p>Verified credentials from Govt. of India (MeitY), NASSCOM, Cisco, GeeksforGeeks, and AICTE EduSkills.</p>
        </div>
      </div>
      
      <div className="certificate-grid">
        {certList.map((c, idx) => {
          const credentialUrl = c.verificationUrl || c.fileUrl || '#';
          const issueYear = String(c.issueDate||'').match(/\b20\d{2}\b/)?.[0] || '2025';
          return (
            <article className="certificate-card" key={c._id || c.title || idx}>
              <div className="certificate-card-top">
                <span className="cert-badge"><CheckCircle2 size={15}/> VERIFIED</span>
                <span className="cert-year">{c.issueDate || issueYear}</span>
              </div>
              <div className="cert-category">{c.category || 'TECHNICAL CERTIFICATION'}</div>
              <h3>{c.title}</h3>
              <p className="cert-issuer">Issued by <strong>{c.issuer}</strong></p>
              {c.college && <p className="cert-subtitle"><small>{c.college}</small></p>}
              {c.description && <p className="cert-desc">{c.description}</p>}
              {c.credentialId && <span className="cert-id">Cert ID: {c.credentialId}</span>}
              <div className="cert-actions">
                <button 
                  type="button" 
                  className="cert-direct-view-btn"
                  onClick={() => setSelectedCert(c)}
                >
                  <Eye size={16}/> Direct View Certificate
                </button>
                <a 
                  className="certificate-link" 
                  href={credentialUrl} 
                  target={credentialUrl !== '#' ? '_blank' : undefined} 
                  rel="noreferrer"
                >
                  <span>Verify Online</span>
                  <ArrowUpRight size={16}/>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Direct Rendered Certificate Document Modal (No Login Required!) */}
      {selectedCert && (
        <div className="modal-backdrop" onClick={() => setSelectedCert(null)}>
          <div className="cert-render-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCert(null)} aria-label="Close certificate">
              <X size={20}/>
            </button>
            
            <div className="cert-document-frame">
              <div className="cert-doc-header">
                <div className="cert-doc-authority">{selectedCert.issuer}</div>
                <div className="cert-doc-badge">
                  <ShieldCheck size={20}/> VERIFIED CREDENTIAL
                </div>
              </div>

              <div className="cert-doc-body">
                <span className="cert-doc-watermark">CERTIFICATE OF ACHIEVEMENT</span>
                <p className="cert-award-line">This is to certify that</p>
                <h1 className="cert-recipient-name">AMIT KUMAR</h1>
                {selectedCert.college && <p className="cert-inst-line">of <strong>{selectedCert.college}</strong></p>}
                <p className="cert-completion-line">has successfully completed the program on</p>
                <h2 className="cert-course-title">{selectedCert.title}</h2>
                {selectedCert.nos && <p className="cert-nos-line">aligned to <strong>{selectedCert.nos}</strong></p>}
                {selectedCert.projectTitle && <p className="cert-project-line"><strong>{selectedCert.projectTitle}</strong></p>}
                <p className="cert-summary-text">{selectedCert.description}</p>
              </div>

              <div className="cert-doc-footer">
                <div className="cert-doc-meta">
                  {selectedCert.issueDate && <div><strong>Date of Issue:</strong> {selectedCert.issueDate}</div>}
                  {selectedCert.credentialId && <div><strong>Certificate ID:</strong> <code>{selectedCert.credentialId}</code></div>}
                  {selectedCert.studentId && <div><strong>Student ID:</strong> <code>{selectedCert.studentId}</code></div>}
                  {selectedCert.grade && <div><strong>Grade:</strong> <span className="grade-pill">{selectedCert.grade}</span></div>}
                </div>
                <div className="cert-signature-block">
                  <div className="cert-sig-line"/>
                  <span className="cert-signatory-title">{selectedCert.signatory || selectedCert.instructor || 'Authorized Signatory'}</span>
                  <small>{selectedCert.issuer}</small>
                </div>
              </div>
            </div>

            <div className="modal-actions mt-4">
              {(selectedCert.verificationUrl || selectedCert.fileUrl) && (
                <a 
                  className="button button-primary" 
                  href={selectedCert.verificationUrl || selectedCert.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Open External Verification Link <ArrowUpRight size={16}/>
                </a>
              )}
              <button className="button button-secondary" onClick={() => setSelectedCert(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Contact({profile={},onChat}){
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''}),[state,setState]=useState('idle');
  const submit=async e=>{
    e.preventDefault();
    setState('sending');
    try{
      await api.post('/contact',form);
      setState('sent');
      setForm({name:'',email:'',subject:'',message:''});
    }catch{
      setState('error');
    }
  };

  return (
    <section className="section contact-section" id="hire">
      <div className="section-kicker"><span>08</span></div>
      <div className="contact-grid">
        <div>
          <h2 className="section-title">Get in Touch</h2>
          <p className="contact-intro">I’m actively open to software engineering internships, collaborative tech projects, and full-time opportunities.</p>
          <div className="contact-methods">
            <a href={`mailto:${profile.contactEmail||'amitkumar.dev.cs@gmail.com'}`}>
              <Mail size={20}/>
              <span><small>EMAIL</small>{profile.contactEmail||'amitkumar.dev.cs@gmail.com'}</span>
              <ArrowUpRight size={18}/>
            </a>
            {profile.phoneNumber&&<a href={`tel:${profile.phoneNumber}`}><span className="contact-method-icon">⌕</span><span><small>PHONE</small>{profile.phoneNumber}</span><ArrowUpRight size={18}/></a>}
            <div><span className="contact-method-icon">⌖</span><span><small>LOCATION</small>{profile.location||'Bihar, India'}</span></div>
          </div>
          <button className="button button-secondary start-chat" onClick={onChat}>Start a quick chat <ArrowUpRight size={16}/></button>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <label>Your Name<input required maxLength="100" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Rahul Sharma"/></label>
          <label>Email Address<input type="email" required maxLength="254" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@example.com"/></label>
          <label>Subject<input maxLength="160" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Project Collaboration / Opportunity"/></label>
          <label>Message<textarea required minLength="10" maxLength="4000" rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me about your project or role…"/></label>
          <button className="button button-primary" disabled={state==='sending'}>
            {state==='sending'?'Sending Message…':state==='sent'?'Message Sent Successfully ✓':<>Send Message <Send size={16}/></>}
          </button>
          {state==='error'&&<p className="form-status error">Couldn’t send message right now. Please email directly.</p>}
          {state==='sent'&&<p className="form-status">Thanks for reaching out! I will respond promptly.</p>}
        </form>
      </div>
    </section>
  );
}

export function WhatsAppContact({profile}){
  const number=String(profile?.whatsappNumber||'').replace(/\D/g,'');
  if(!number)return null;
  return (
    <div className="whatsapp-extra">
      <a className="button button-secondary" href={`https://wa.me/${number}`} target="_blank" rel="noreferrer">
        Message on WhatsApp <ArrowUpRight size={16}/>
      </a>
    </div>
  );
}


