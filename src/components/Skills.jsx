import '../styles/skills.css';
import SkillsMarquee from './SkillsMarquee';
import { useInView } from '../hooks/useInView';

import InDesign      from '../assets/Adobe-InDesign-Logo.png';
import Photoshop     from '../assets/Adobe-Photoshop-Logo.png';
import Claude        from '../assets/claude-logo.svg';
import Gemini        from '../assets/Google-Gemini.png';
import CSS           from '../assets/icons8-css-144.png';
import HTMLIMG       from '../assets/html.png';
import JavascriptIcon from '../assets/icons8-javascript-100.png';
import ReactIcon     from '../assets/icons8-react-100.png';
import Illustrator    from '../assets/Adobe_Illustrator_CC_icon.png';
import GitIcon       from '../assets/icons8-git-144.png';
import PythonIcon    from '../assets/icons8-python-100.png';

const SKILL_IMAGES = [
  { src: HTMLIMG,        alt: 'HTML'        },
  { src: CSS,            alt: 'CSS'         },
  { src: JavascriptIcon, alt: 'JavaScript'  },
  { src: ReactIcon,      alt: 'React'       },
  { src: PythonIcon,     alt: 'Python'      },
  { src: Photoshop,      alt: 'Photoshop'   },
  { src: Illustrator,     alt: 'Illustrator' },
  { src: InDesign,       alt: 'Indesign'    },
  { src: GitIcon,        alt: 'Git'         },
  { src: Claude,         alt: 'Claude'      },
  { src: Gemini,         alt: 'Gemini'      },
];

const EDUCATION = [
  {
    institution: 'Jomo Kenyatta University of Agriculture and Technology',
    degree:      'Bachelor of Science in Electrical and Electronics Engineering',
    period:      '2026 – 2030',
    description: 'Add a short summary of your studies, focus areas, or notable achievements here.',
  },
];

const CERTIFICATIONS = [
  {
    name:   'Software Engineering',
    issuer: 'Moringa School',
    year:   '2026',
    description: [
      'Mastered full-stack web development across HTML, CSS, JavaScript, React, Python, and Flask — building real-world projects at every stage.',
      'Developed interactive front-end applications using React, including component-based architecture, state management, and API integration.',
      'Built secure REST APIs and relational database systems using Flask, SQLAlchemy, and JWT authentication.',
      'Completed a full-stack capstone project with a React frontend, Flask backend, and a relational database, solving a real business problem.',
      'Strengthened professional skills through career coaching, mock interviews, and portfolio development with job-hunting support.',
    ],
  },
  {
    name:   'Graphic Design Masterclass',
    issuer: 'Udemy.com',
    year:   '2026',
    description: [
      'Gained a strong foundation in design theory — covering color theory, typography, composition, layout rules, and grid systems.',
      'Built hands-on projects in Adobe Photoshop, Illustrator, and InDesign through real-world advertising and branding projects.',
      'Constructed a personal design portfolio of original work produced throughout the course, ready for client and employer presentation.',
      'Learned to integrate AI tools such as Nano Banana Pro into the design workflow for faster, more creative output.',
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

          {/* ── Education (uncomment and fill in when ready) ── */}
          {/* <div className="edu-cert-col">
            <h3 className="col-heading">Education</h3>
            {EDUCATION.map((item, i) => (
              <div className="card" key={i}>
                <div className="card-top">
                  <span className="card-title">{item.degree}</span>
                  <span className="card-period">{item.period}</span>
                </div>
                <p className="card-sub">{item.institution}</p>
                {item.description && (
                  <p className="card-desc">{item.description}</p>
                )}
              </div>
            ))}
          </div> */}

          {/* ── Certifications ── */}
          <div className="edu-cert-col">
            <h3 className="col-heading">Certifications</h3>
            {CERTIFICATIONS.map((item, i) => (
              <div className="card" key={i}>
                <div className="card-top">
                  <span className="card-title">{item.name}</span>
                  <span className="card-period">{item.year}</span>
                </div>
                <p className="card-sub">{item.issuer}</p>
                {item.description && (
                  <ul className="card-desc-list">
                  {item.description.map((point, j) => (
                      <li key={j} className="card-desc">{point}</li>
                  ))}
                 </ul>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}