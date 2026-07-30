import '../styles/skills.css';
import SkillsMarquee from './SkillsMarquee';
import { useInView } from '../hooks/useInView';

import InDesign       from '../assets/Adobe-InDesign-Logo.webp';
import Photoshop      from '../assets/Adobe-Photoshop-Logo.webp';
import Claude         from '../assets/claude-logo.svg';
import JavascriptIcon from '../assets/icons8-javascript-100.webp';
import ReactIcon      from '../assets/icons8-react-100.webp';
import Illustrator    from '../assets/Adobe_Illustrator_CC_icon.webp';
import PythonIcon     from '../assets/icons8-python-100.webp';

const SKILL_IMAGES = [
  { src: JavascriptIcon, alt: 'JavaScript'  },
  { src: ReactIcon,      alt: 'React'       },
  { src: PythonIcon,     alt: 'Python'      },
  { src: Photoshop,      alt: 'Photoshop'   },
  { src: Illustrator,    alt: 'Illustrator' },
  { src: InDesign,       alt: 'Indesign'    },
  { src: Claude,         alt: 'Claude'      },
];

const EDUCATION = [
  {
    degree:        'Electrical and Electronics Engineering',
    institution: 'Jomo Kenyatta University of Agriculture and Technology',
    period:      '2026 - 2031',
    type: 'education',
    description : [
      'Mastered core electrical and electronics engineering principles across circuit theory, digital logic, electromagnetics, and signal processing — reinforced through hands-on labs at every stage.',
      'Developed practical circuit design and analysis skills using simulation tools including filter design, amplifier analysis, and control systems.',
      'Built embedded systems and microcontroller-based projects using platforms like Arduino, ESP32, and PIC, integrating sensors, actuators, and real-time control logic.',
      'Completed a full capstone project spanning circuit design, embedded programming, and power electronics, solving a real-world engineering problem from concept to prototype.',
    ], 
  },
  {
    name:        'Software Engineering',
    institution: 'Moringa School',
    period:      '2026',
    description: [
      'Mastered full-stack web development across HTML, CSS, JavaScript, React, Python, and Flask — building real-world projects at every stage.',
      'Developed interactive front-end applications using React, including component-based architecture, state management, and API integration.',
      'Built secure REST APIs and relational database systems using Flask, SQLAlchemy, and JWT authentication.',
      'Completed a full-stack capstone project with a React frontend, Flask backend, and a relational database, solving a real business problem.',
      'Strengthened professional skills through career coaching, mock interviews, and learning soft skills with job-hunting support.',
    ],
    type: 'certification',
  },
  {
    name:        'Graphic Design Masterclass',
    institution: 'Udemy.com',
    period:      '2026',
    description: [
      'Gained a strong foundation in design theory — covering color theory, typography, composition, layout rules, and grid systems.',
      'Built hands-on projects in Adobe Photoshop, Illustrator, and InDesign through real-world advertising and branding projects.',
      'Constructed a personal design portfolio of original work produced throughout the course, ready for client and employer presentation.',
      'Learned to integrate AI tools such as Nano Banana Pro into the design workflow for faster, more creative output.',
    ],
    type: 'certification',
  },
];

const EXPERIENCE = [
  {
    role:        'Your Job Title',
    company:     'Company Name',
    period:      'Month Year – Present',
    description: [
      'Describe a key responsibility or achievement here.',
      'Add another bullet point highlighting your impact or skills used.',
    ],
  },
];

export default function Skills({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';
  const [sectionRef, isInView] = useInView(0.3);

  return (
    <section
      ref={sectionRef}
      className={`skills-section ${themeClass} ${isInView ? 'in-view' : ''}`}
      id="skills"
    >
      <h1 className="skills-watermark">Skills</h1>

      <div className="skills-intro">
        <p className="skills-label">What do i work with?</p>
        <h2 className="skills-heading">
          Tools used to build{' '}
          <span className="serif-word">great</span> things.
        </h2>
        <div className="skills-divider" />
      </div>

      <SkillsMarquee images={SKILL_IMAGES} />

      <div className="skills-content">
        <div className="edu-cert-grid">

          {/* ── Education & Certifications ── */}
          <div className="edu-cert-col">
            <h3 className="col-heading">Education &amp; Certifications</h3>

            {EDUCATION.map((item, i) => (
              <div key={i} className="card">
                <div className="card-top">
                  <span className="card-title">
                    {item.type === 'education' ? item.degree : item.name}
                  </span>
                  <span className="card-period">{item.period}</span>
                </div>
                <p className="card-sub">{item.institution}</p>
                {item.description && (
                  Array.isArray(item.description) ? (
                    <ul className="card-desc-list">
                      {item.description.map((point, j) => (
                        <li key={j} className="card-desc">{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="card-desc">{item.description}</p>
                  )
                )}
              </div>
            ))}
          </div>

          {/* ── Experience (uncomment when ready) ── */}
          {/* <div className="edu-cert-col">
            <h3 className="col-heading">Experience</h3>
            {EXPERIENCE.map((item, i) => (
              <div key={i} className="card">
                <div className="card-top">
                  <span className="card-title">{item.role}</span>
                  <span className="card-period">{item.period}</span>
                </div>
                <p className="card-sub">{item.company}</p>
                {item.description && (
                  <ul className="card-desc-list">
                    {item.description.map((point, j) => (
                      <li key={j} className="card-desc">{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div> */}

        </div>
      </div>
    </section>
  );
}