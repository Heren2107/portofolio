import { useEffect, useRef, useState } from "react";

const navItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "work", label: "Work", path: "/work" },
  { id: "profile", label: "Profile", path: "/profile" },
  { id: "contact", label: "Contact", path: "/contact" },
];

const projects = [
  {
    number: "01",
    name: "Massion Brasserie",
    category: "Cafe · Website",
    year: "2023",
    visual: "massion",
    mark: "MASSION",
    note: "Mari nikmati secangkir kopi.",
    href: "https://masionfixxx-io.vercel.app/",
  },
  {
    number: "02",
    name: "DesignLearn",
    category: "Design learning platform · Website",
    year: "2024",
    visual: "designlearn",
    note : "design learning" ,
    image: "/designlearn-scroll-preview.png",
    href: "https://design-learnn-io.vercel.app/",
  },
  {
    number: "03",
    name: "Form & Field",
    category: "Brand identity · Digital",
    year: "2025",
    visual: "field",
    mark: "f&f",
    note: "A softer kind of everyday.",
  },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon--diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M3.75 10h12.5M10.5 4.25 16.25 10l-5.75 5.75" />
    </svg>
  );
}

function LiquidNav({
  activePage,
  onNavigate,
}: {
  activePage: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <nav className="liquid-nav" aria-label="Main navigation">
      <span
        className="nav-indicator"
        style={{
          "--active-index": navItems.findIndex((item) => item.id === activePage),
        } as React.CSSProperties}
      />
      {navItems.map((item) => (
        <a
          className={activePage === item.id ? "nav-link is-active" : "nav-link"}
          href={item.path}
          key={item.id}
          aria-current={activePage === item.id ? "page" : undefined}
          onClick={(event) => {
            if (
              event.button === 0 &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey
            ) {
              event.preventDefault();
              onNavigate(item.path);
            }
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function ProjectArtwork({
  project,
  showArrow = true,
}: {
  project: (typeof projects)[number];
  showArrow?: boolean;
}) {
  return (
    <div className={`project-art project-art--${project.visual}`}>
      {"image" in project && (
        <img className="project-art__image" src={project.image} alt="" loading="eager" />
      )}
      {"href" in project && !("image" in project) && (
        <iframe
          className="project-art__iframe"
          src={project.href}
          title={`${project.name} live preview`}
          loading="eager"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
      {!("image" in project) && !("href" in project) && (
        <>
          <span className="project-art__eyebrow">{project.category}</span>
          <span className="project-art__mark">{project.mark}</span>
          <span className="project-art__note">{project.note}</span>
          <span className="project-art__index">SELECTED WORK&nbsp; / &nbsp;{project.number}</span>
        </>
      )}
      {showArrow && (
        <span className="project-arrow">
          <ArrowIcon diagonal />
        </span>
      )}
    </div>
  );
}

function ProjectMeta({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="project-meta">
      <div>
        <h3>{project.name}</h3>
        <p>{project.category}</p>
      </div>
      <span>{project.year}</span>
    </div>
  );
}

function ProjectCard({
  project,
  onNavigate,
}: {
  project: (typeof projects)[number];
  onNavigate: (path: string) => void;
}) {
  return (
    <a
      className={`project-card project-card--${project.visual} reveal`}
      href={project.href ?? "/contact"}
      aria-label={project.href ? `Visit ${project.name} website` : `Discuss the ${project.name} project`}
      target={project.href ? "_blank" : undefined}
      rel={project.href ? "noreferrer" : undefined}
      onClick={(event) => {
        if (project.href) return;
        event.preventDefault();
        onNavigate("/contact");
      }}
    >
      <ProjectArtwork project={project} />
      <ProjectMeta project={project} />
    </a>
  );
}

function HomeWorks() {
  const [activeProject, setActiveProject] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let currentProject = -1;
    const updateProjectFromScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollDistance = section.offsetHeight - window.innerHeight;
        const progress = scrollDistance > 0
          ? Math.max(0, Math.min(1, -section.getBoundingClientRect().top / scrollDistance))
          : 0;
        const viewport = carouselRef.current?.querySelector<HTMLElement>(
          ".home-works__viewport",
        );
        const track = carouselRef.current?.querySelector<HTMLElement>(
          ".home-works__track",
        );
        const stage = section.querySelector<HTMLElement>(".home-works__stage");
        const heading = section.querySelector<HTMLElement>(".home-works__heading");
        const controls = section.querySelector<HTMLElement>(".home-works__controls");
        const slides = track?.querySelectorAll<HTMLElement>(".home-works__slide");

        if (viewport && track && stage && heading && controls && slides?.length) {
          const stageStyle = window.getComputedStyle(stage);
          const headingStyle = window.getComputedStyle(heading);
          const controlsStyle = window.getComputedStyle(controls);
          const metaHeight = Array.from(slides).reduce((height, slide) => {
            const meta = slide.querySelector<HTMLElement>(".project-meta");
            return Math.max(height, meta?.offsetHeight ?? 0);
          }, 0);
          const reservedHeight =
            parseFloat(stageStyle.paddingTop) +
            parseFloat(stageStyle.paddingBottom) +
            heading.offsetHeight +
            parseFloat(headingStyle.marginBottom) +
            controls.offsetHeight +
            parseFloat(controlsStyle.marginTop) +
            metaHeight +
            8;
          const availableArtworkHeight = Math.max(
            180,
            stage.clientHeight - reservedHeight,
          );
          const slideWidth = Math.min(
            viewport.clientWidth * 0.92,
            availableArtworkHeight * (16 / 9),
          );
          const gap = viewport.clientWidth * 0.025;
          const step = slideWidth + gap;
          const offset =
            (viewport.clientWidth - slideWidth) / 2 -
            progress * (projects.length - 1) * step;

          track.style.gap = `${gap}px`;
          track.style.transform = `translate3d(${offset}px, 0, 0)`;
          slides.forEach((slide, index) => {
            slide.style.flex = `0 0 ${slideWidth}px`;
            slide.style.width = `${slideWidth}px`;
            const distance = Math.min(1, Math.abs(progress * (projects.length - 1) - index));
            slide.style.opacity = String(1 - distance * 0.78);
            slide.style.filter = `blur(${distance * 7}px)`;
            slide.style.transform = `scale(${1 - distance * 0.055})`;
          });
        }

        const nextProject = Math.round(progress * (projects.length - 1));

        if (currentProject !== nextProject) {
          currentProject = nextProject;
          setActiveProject(nextProject);
        }

        frame = 0;
      });
    };

    updateProjectFromScroll();
    window.addEventListener("scroll", updateProjectFromScroll, { passive: true });
    window.addEventListener("resize", updateProjectFromScroll);

    return () => {
      window.removeEventListener("scroll", updateProjectFromScroll);
      window.removeEventListener("resize", updateProjectFromScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const showProject = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const projectIndex = (index + projects.length) % projects.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveProject(projectIndex);
      return;
    }

    const scrollDistance = section.offsetHeight - window.innerHeight;
    const targetY =
      window.scrollY + section.getBoundingClientRect().top +
      (projectIndex / (projects.length - 1)) * scrollDistance;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  return (
    <section className="home-works" ref={sectionRef} aria-labelledby="home-works-title">
      <div className="home-works__stage">
        <div className="home-works__panel">
          <div className="home-works__heading reveal">
            <div className="home-works__panel-topline">
              <span>HARDIANSYAH TRI DHARMA&nbsp; / &nbsp;PORTFOLIO</span>
              <span>SELECTED PROJECTS&nbsp; · &nbsp;2023 — 2025</span>
            </div>
            <div className="home-works__title-row">
              <div>
                <p className="eyebrow">A FEW THINGS I’VE MADE</p>
                <h2 id="home-works-title">Selected work<span className="heading-period">.</span></h2>
              </div>
              <p className="home-works__intro">
                A collection of digital experiences and identities, thoughtfully
                made from first sketch to final detail.
              </p>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="home-works__carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Selected projects"
          >
            <div className="home-works__grid home-works__viewport">
              <div className="home-works__track">
                {projects.map((project, index) => {
                  const isActive = activeProject === index;
                  const slideClassName = [
                    "home-work-card",
                    "home-works__slide",
                    `home-work-card--${project.visual}`,
                    `project-card--${project.visual}`,
                    isActive ? "is-active" : "",
                  ].filter(Boolean).join(" ");

                  return project.href ? (
                    <a
                      className={slideClassName}
                      href={project.href}
                      key={project.number}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${project.name} website`}
                      aria-hidden={!isActive}
                      tabIndex={isActive ? undefined : -1}
                    >
                      <ProjectArtwork project={project} showArrow />
                      <ProjectMeta project={project} />
                    </a>
                  ) : (
                    <article
                      className={slideClassName}
                      key={project.number}
                      aria-hidden={!isActive}
                    >
                      <ProjectArtwork project={project} showArrow={false} />
                      <ProjectMeta project={project} />
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="home-works__controls">
              <button
                className="home-works__arrow home-works__arrow--previous"
                type="button"
                aria-label="Previous project"
                onClick={() => showProject(activeProject - 1)}
              >
                <ArrowIcon />
              </button>
              <div className="home-works__pagination" aria-label="Choose a project">
                {projects.map((project, index) => (
                  <button
                    className={index === activeProject ? "is-active" : ""}
                    type="button"
                    key={project.number}
                    aria-label={`Show project ${project.number}: ${project.name}`}
                    aria-current={index === activeProject ? "true" : undefined}
                    onClick={() => showProject(index)}
                  />
                ))}
              </div>
              <span className="home-works__count">
                {projects[activeProject].number}&nbsp; / &nbsp;{String(projects.length).padStart(2, "0")}
              </span>
              <button
                className="home-works__arrow"
                type="button"
                aria-label="Next project"
                onClick={() => showProject(activeProject + 1)}
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrganizationSection() {
  const moments = [
    { number: "01", title: "Organization activity", image: "/organization-1.png" },
    { number: "02", title: "Working together", image: "/organization-2.png" },
    { number: "03", title: "Community moments", image: "/organization-3.png" },
  ];

  return (
    <section className="organization-section" aria-labelledby="organization-title">
      <div className="organization-section__heading reveal">
        <div>
          <p className="eyebrow">BEYOND THE SCREEN</p>
          <h2 id="organization-title">Organization<span className="heading-period">.</span></h2>
        </div>
        <p className="organization-section__intro">
          A few moments from the people and communities I’ve been part of.
        </p>
      </div>
      <div className="organization-gallery">
        {moments.map((moment) => (
          <article className="organization-card reveal" key={moment.number}>
            <div
              className={`organization-card__photo organization-card__photo--${moment.number}`}
            >
              <img
                src={moment.image}
                alt={moment.title}
                loading="lazy"
                decoding="async"
              />
              <span className="organization-card__photo-label">PHOTO&nbsp; / &nbsp;{moment.number}</span>
            </div>
            <div className="organization-card__caption">
              <h3>{moment.title}</h3>
              <span>{moment.number}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type SkillName =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "React"
  | "TypeScript"
  | "Figma"
  | "UI/UX Design"
  | "Wireframing"
  | "Prototyping";

function SkillIcon({ name }: { name: SkillName }) {
  const initials: Partial<Record<SkillName, string>> = {
    JavaScript: "JS",
    TypeScript: "TS",
  };

  if (initials[name]) {
    return <span className="skill-icon skill-icon--letters" aria-hidden="true">{initials[name]}</span>;
  }

  return (
    <svg className={`skill-icon skill-icon--${name.toLowerCase().replace(/[^a-z]+/g, "-")}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === "HTML" && (
        <>
          <path d="M4.5 2.8h15l-1.4 16.1-6.1 2.3-6.1-2.3L4.5 2.8Z" fill="currentColor" />
          <path d="M8 7.2h8l-.2 2H10l.2 1.8h5.4l-.6 5.4-3 1.1-3-1.1-.2-2.2h2l.1.8 1.1.4 1.1-.4.2-2H8.4L8 7.2Z" fill="var(--paper)" />
        </>
      )}
      {name === "CSS" && (
        <>
          <path d="M4.5 2.8h15l-1.4 16.1-6.1 2.3-6.1-2.3L4.5 2.8Z" fill="currentColor" />
          <path d="M8 7.2h8l-.2 2h-5.7l.2 1.8h5.4l-.6 5.4-3 1.1-3-1.1-.2-2.2h2l.1.8 1.1.4 1.1-.4.2-2H8.4L8 7.2Z" fill="var(--paper)" />
        </>
      )}
      {name === "React" && (
        <>
          <ellipse cx="12" cy="12" rx="9.4" ry="3.7" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="9.4" ry="3.7" transform="rotate(60 12 12)" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="9.4" ry="3.7" transform="rotate(120 12 12)" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        </>
      )}
      {name === "Figma" && (
        <>
          <path d="M12 2.5H8.5a3.5 3.5 0 1 0 0 7H12v-7Z" fill="currentColor" />
          <path d="M12 2.5h3.5a3.5 3.5 0 1 1 0 7H12v-7Z" fill="currentColor" opacity=".68" />
          <path d="M8.5 9.5H12v7H8.5a3.5 3.5 0 1 1 0-7Z" fill="currentColor" opacity=".82" />
          <circle cx="15.5" cy="13" r="3.5" fill="currentColor" />
          <path d="M12 16.5H8.5a3.5 3.5 0 1 0 3.5 3.5v-3.5Z" fill="currentColor" opacity=".55" />
        </>
      )}
      {name === "UI/UX Design" && (
        <>
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 21h8M12 17v4M7 8h4M7 11h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {name === "Wireframing" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9h18M9 9v12M15 9v12M3 15h18" stroke="currentColor" strokeWidth="1.4" />
        </>
      )}
      {name === "Prototyping" && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="m10 8 5 4-5 4V8Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const storyRef = useRef<HTMLElement>(null);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const storySection = storyRef.current;
    if (!storySection) return;

    const storyCount = 3;
    let frame = 0;
    let currentStory = -1;
    const updateStory = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        const scrollDistance = storySection.offsetHeight - window.innerHeight;
        const progress = scrollDistance > 0
          ? Math.max(0, Math.min(1, -storySection.getBoundingClientRect().top / scrollDistance))
          : 0;
        const position = progress * (storyCount - 1);
        const nextStory = Math.min(storyCount - 1, Math.round(position));

        storySection.style.setProperty(
          "--home-photo-scale",
          String(1.04 + progress * 0.18),
        );
        storySection.style.setProperty(
          "--home-photo-blur",
          `${progress * 5}px`,
        );

        for (let index = 0; index < storyCount; index += 1) {
          const distance = position - index;
          const opacity = Math.max(0, 1 - Math.abs(distance));
          const offset = Math.max(-1, Math.min(1, distance)) * -44;
          storySection.style.setProperty(`--home-story-${index + 1}-opacity`, String(opacity));
          storySection.style.setProperty(`--home-story-${index + 1}-y`, `${offset}px`);
          storySection.style.setProperty(
            `--home-story-${index + 1}-scale`,
            String(0.96 + opacity * 0.04),
          );
          storySection.style.setProperty(
            `--home-story-${index + 1}-blur`,
            `${(1 - opacity) * 7}px`,
          );
        }

        if (currentStory !== nextStory) {
          currentStory = nextStory;
          setActiveStory(nextStory);
        }

        frame = 0;
      });
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      updateStory();
      window.addEventListener("scroll", updateStory, { passive: true });
      window.addEventListener("resize", updateStory);
    }

    return () => {
      window.removeEventListener("scroll", updateStory);
      window.removeEventListener("resize", updateStory);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section className="home-hero-story" ref={storyRef} aria-label="Introduction">
        <div className="home-hero">
          <div className="home-hero__visual">
            <img
              className="home-hero__photo"
              src="/home-photo-new.jpg"
              alt=""
              loading="eager"
            />
            <div className="home-hero__shade" />
            <div className="home-hero__topline">
              <span>INDEPENDENT DESIGNER&nbsp; / &nbsp;CREATIVE DEVELOPER</span>
              <span>BASED IN INDONESIA&nbsp; — &nbsp;WORKING EVERYWHERE</span>
            </div>
            <span className="home-hero__index">H.T.D&nbsp; / &nbsp;INDEPENDENT CREATIVE</span>
          </div>
          <div className="home-hero__content">
            <article
              className="home-hero__story home-hero__story--one"
              data-active={activeStory === 0}
              aria-hidden={activeStory !== 0}
            >
              <p className="eyebrow">HELLO, I’M HARDIANSYAH TRI DHARMA</p>
              <h1>Designing things<br />that <span className="serif-word">feel</span> like you.</h1>
              <p className="home-hero__description">
                Thoughtful digital experiences and visual identities, made with
                clarity, character, and a human touch.
              </p>
              <button className="home-hero__cta" onClick={() => onNavigate("/work")} tabIndex={activeStory === 0 ? 0 : -1}>
                Explore my work <ArrowIcon />
              </button>
            </article>
            <article
              className="home-hero__story home-hero__story--two"
              data-active={activeStory === 1}
              aria-hidden={activeStory !== 1}
            >
              <p className="eyebrow">GOOD DESIGN STARTS WITH PEOPLE</p>
              <h2>Make it clear.<br />Make it <span className="serif-word">matter.</span></h2>
              <p className="home-hero__description">
                I bring design and technology together to make everyday
                experiences feel more intuitive.
              </p>
              <button className="home-hero__cta" onClick={() => onNavigate("/profile")} tabIndex={activeStory === 1 ? 0 : -1}>
                A little about me <ArrowIcon />
              </button>
            </article>
            <article
              className="home-hero__story home-hero__story--three"
              data-active={activeStory === 2}
              aria-hidden={activeStory !== 2}
            >
              <p className="eyebrow">FROM FIRST SKETCH TO FINAL DETAIL</p>
              <h2>Thoughtful by nature.<br /><span className="serif-word">Intentional</span> by design.</h2>
              <p className="home-hero__description">
                Explore a few projects shaped by curiosity, craft, and care.
              </p>
              <button className="home-hero__cta" onClick={() => onNavigate("/work")} tabIndex={activeStory === 2 ? 0 : -1}>
                Discover selected work <ArrowIcon />
              </button>
            </article>
          </div>
          <span className="home-hero__scroll">SCROLL TO EXPLORE&nbsp; ↓</span>
        </div>
      </section>
      <HomeWorks />
      <OrganizationSection />
    </>
  );
}

function WorkPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="work-page page-enter section-shell">
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">A FEW THINGS I’VE MADE</p>
          <h1>Selected work<span className="heading-period">.</span></h1>
        </div>
        <span className="section-count">2024 — 2026&nbsp; / &nbsp;{String(projects.length).padStart(2, "0")}</span>
      </div>
      <p className="work-page__intro reveal">
        A selection of identities and digital experiences, made with care from
        the first sketch to the final detail.
      </p>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.number} project={project} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

function ProfilePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="profile-section page-enter section-shell">
      <div className="profile-heading reveal">
        <p className="eyebrow">A LITTLE ABOUT ME</p>
        <span className="profile-doodle" aria-hidden="true">✳</span>
      </div>
      <div className="profile-content reveal">
        <figure className="profile-portrait">
          <img
            className="profile-portrait__art"
            src="/profile-photo.png"
            alt="Hardiansyah Tri Dharma in front of the Landmark building"
            width="397"
            height="501"
            decoding="async"
          />
          <figcaption className="profile-portrait__caption">
            <span>PORTRAIT STUDY&nbsp; / &nbsp;H.T.D</span>
            <span>01 — 01</span>
          </figcaption>
        </figure>
        <div className="profile-story">
          <h1>
            Curious by nature.
            <br />
            <span className="serif-word">Intentional</span> by design.
          </h1>
          <div className="profile-copy">
            <p>
              Hi, I’m a System Information student with a strong interest in UI/UX
              design and creating meaningful digital experiences. I enjoy exploring
              how design and technology can work together to solve problems and make
              everyday interactions more intuitive.
            </p>
            <p>
              I’m always eager to learn, explore new ideas, and improve my skills
              through real-world projects. To me, good design is not just about how
              things look, but also about how they work and how people feel when
              using them.
            </p>
            <p>
              Good collaboration makes good work. I partner with kind people who
              care about what they put into the world.
            </p>
            <a
              className="text-link"
              href="/contact"
              onClick={(event) => { event.preventDefault(); onNavigate("/contact"); }}
            >
              More about working together <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
      <section className="skills-section reveal" aria-labelledby="skills-title">
        <div className="skills-heading">
          <p className="eyebrow">WHAT I WORK WITH</p>
          <h2 id="skills-title">Skills &amp; tools<span className="heading-period">.</span></h2>
        </div>
        <div className="skills-groups">
          <div className="skills-group">
            <h3>Development</h3>
            <ul>
              {(["HTML", "CSS", "JavaScript", "React", "TypeScript"] as const).map((skill) => (
                <li key={skill}><SkillIcon name={skill} /><span>{skill}</span></li>
              ))}
            </ul>
          </div>
          <div className="skills-group">
            <h3>Design</h3>
            <ul>
              {(["Figma", "UI/UX Design", "Wireframing", "Prototyping"] as const).map((skill) => (
                <li key={skill}><SkillIcon name={skill} /><span>{skill}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className="profile-footer reveal">
        <span>STRATEGY&nbsp; / &nbsp;IDENTITY&nbsp; / &nbsp;DIGITAL&nbsp; / &nbsp;DETAIL</span>
        <span>THOUGHTFULLY MADE, ALWAYS.</span>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="contact-page page-enter section-shell">
      <div className="contact-topline reveal">
        <p className="eyebrow">HAVE A GOOD ONE IN MIND?</p>
        <span>THE NEXT CHAPTER STARTS HERE</span>
      </div>
      <a className="contact-title reveal" href="hardiansyahtd@gmail.com">
        Let’s make
        <br />
        <span className="serif-word">something</span> matter.
        <span className="contact-title__arrow"><ArrowIcon diagonal /></span>
      </a>
      <div className="contact-footer reveal">
        <a className="email-link" href="hardiansyahtd@gmail.com">
          hardiansyahtd@gmail.com
        </a>
        <p>OPEN TO THE RIGHT KIND OF COLLABORATION.</p>
        <span>INDONESIA&nbsp; / &nbsp;AVAILABLE WORLDWIDE</span>
      </div>
    </section>
  );
}

function pageFromPath(path: string) {
  const page = navItems.find((item) => item.path === path);
  return page?.id ?? "home";
}

function IntroLoader({
  progress,
  exiting,
}: {
  progress: number;
  exiting: boolean;
}) {
  return (
    <div
      className={`intro-loader${exiting ? " intro-loader--exiting" : ""}`}
      role="status"
      aria-label={`Loading portfolio, ${progress}%`}
      aria-live="polite"
      aria-hidden={exiting}
    >
      <div className="intro-loader__topline">
        <span>H.T.D&nbsp; / &nbsp;INDEPENDENT CREATIVE</span>
        <span>PORTFOLIO&nbsp; — &nbsp;2025</span>
      </div>
      <div className="intro-loader__center">
        <span className="intro-loader__symbol">H.</span>
        <span className="intro-loader__label">A LITTLE MOMENT</span>
      </div>
      <div className="intro-loader__bottom">
        <div className="intro-loader__progress">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="intro-loader__readout">
          <span>LOADING PORTFOLIO</span>
          <span>{String(progress).padStart(2, "0")}%</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState(() => pageFromPath(window.location.pathname));
  const [headerHidden, setHeaderHidden] = useState(false);
  const [introState, setIntroState] = useState<"loading" | "exiting" | "done">(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "loading",
  );
  const [introProgress, setIntroProgress] = useState(0);

  useEffect(() => {
    if (introState !== "loading") return;

    const duration = 1500;
    let frame = 0;
    let exitTimer = 0;
    const startedAt = performance.now();

    const updateProgress = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setIntroProgress(Math.round(progress * 100));

      if (progress < 1) {
        frame = window.requestAnimationFrame(updateProgress);
      } else {
        exitTimer = window.setTimeout(() => setIntroState("exiting"), 220);
      }
    };

    frame = window.requestAnimationFrame(updateProgress);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (exitTimer) window.clearTimeout(exitTimer);
    };
  }, [introState]);

  useEffect(() => {
    if (introState !== "exiting") return;
    const timer = window.setTimeout(() => setIntroState("done"), 900);
    return () => window.clearTimeout(timer);
  }, [introState]);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setActivePage(pageFromPath(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(pageFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const distance = currentY - previousY;
      const hasKeyboardFocus = document.querySelector(".site-header :focus-visible");

      if (currentY < 80 || distance < -7 || hasKeyboardFocus) {
        setHeaderHidden(false);
      } else if (distance > 7) {
        setHeaderHidden(true);
      }

      previousY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(".reveal");
    const root = document.documentElement;
    root.classList.add("motion-ready");
    let revealObserver: IntersectionObserver | undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      const isHomePage = activePage === "home";
      let previousY = window.scrollY;
      let scrollFrame = 0;
      const handleScroll = () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const distance = currentY - previousY;

          if (Math.abs(distance) > 3) {
            root.dataset.scrollDirection = distance > 0 ? "down" : "up";
            previousY = currentY;
          }

          scrollFrame = 0;
        });
      };

      if (isHomePage) {
        root.dataset.scrollDirection = "down";
        window.addEventListener("scroll", handleScroll, { passive: true });
      }

      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (isHomePage) {
              entry.target.classList.toggle("is-visible", entry.isIntersecting);
            } else if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        isHomePage
          ? { rootMargin: "8% 0px 8% 0px", threshold: 0.01 }
          : { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      revealElements.forEach((element) => revealObserver?.observe(element));

      return () => {
        if (isHomePage) {
          window.removeEventListener("scroll", handleScroll);
          if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
        }
        revealObserver?.disconnect();
      };
    }

    return () => revealObserver?.disconnect();
  }, [activePage]);

  const isHome = activePage === "home";

  return (
    <>
      {introState !== "done" && (
        <IntroLoader progress={introProgress} exiting={introState === "exiting"} />
      )}
      <header
        className={[
          "site-header",
          isHome ? "site-header--home" : "",
          headerHidden ? "site-header--hidden" : "",
        ].filter(Boolean).join(" ")}
        onFocusCapture={() => setHeaderHidden(false)}
      >
        <a
          className="wordmark"
          href="/"
          aria-label="Hardiansyah Tri Dharma, home"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          <span className="wordmark__symbol">H.</span>
          <span className="wordmark__name">Hardiansyah Tri Dharma</span>
        </a>
        <div className="availability">
          <span className="availability__dot" />
          <span>Available for select projects</span>
        </div>
        <LiquidNav activePage={activePage} onNavigate={navigate} />
      </header>

      <main key={activePage} className={`route-view${isHome ? " route-view--home" : ""}`}>
        {activePage === "home" && <HomePage onNavigate={navigate} />}
        {activePage === "work" && <WorkPage onNavigate={navigate} />}
        {activePage === "profile" && <ProfilePage onNavigate={navigate} />}
        {activePage === "contact" && <ContactPage />}
      </main>

      {!isHome && (
        <footer className="site-footer">
          <span>© 2025 HARDIANSYAH TRI DHARMA</span>
          <div>
            <a href="https://www.instagram.com/justhardians/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
          </div>
          <a href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
            BACK HOME ↑
          </a>
        </footer>
      )}
    </>
  );
}

export default App;
