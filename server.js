const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

app.use(cors());
app.use(express.json());

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  githubLink: String,
  liveLink: String
});

const Project = mongoose.model('Project', projectSchema);

const seedDatabase = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      const defaultProjects = [
        {
          title: 'Task Management Application',
          description: 'A full-stack web application featuring complete CRUD operations, user states, and tracking updates.',
          technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
          githubLink: 'https://github.com/mr-roshanjaiswal',
          liveLink: '#'
        },
        {
          title: 'E-Commerce Web Application',
          description: 'An online store application supporting clean product catalogs, cart logic, and data handling layers.',
          technologies: ['Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
          githubLink: 'https://github.com/mr-roshanjaiswal',
          liveLink: '#'
        },
        {
          title: 'Blog Platform with Comments',
          description: 'A functional content delivery platform managing seamless creation, updates, and user interaction streams.',
          technologies: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
          githubLink: 'https://github.com/mr-roshanjaiswal',
          liveLink: '#'
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log('🌱 Database seeded with default internship projects!');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    seedDatabase();
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Roshan Jaiswal | Full Stack Developer Portfolio</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        :root { --primary: #2563eb; --dark: #1e293b; --light: #f8fafc; --text: #334155; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; scroll-behavior: smooth; }
        body { color: var(--text); line-height: 1.6; background-color: #fff; }
        a { color: inherit; }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 10%; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
        .navbar .logo { font-size: 1.5rem; font-weight: 700; color: var(--dark); }
        .navbar .logo span { color: var(--primary); }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { text-decoration: none; color: var(--text); font-weight: 500; transition: 0.3s; }
        .nav-links a:hover { color: var(--primary); }
        .hero { min-height: 80vh; display: flex; align-items: center; padding: 0 10%; background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); }
        .hero-content h3 { color: var(--primary); font-size: 1.3rem; margin-bottom: 0.5rem; }
        .hero-content h1 { font-size: clamp(2.5rem, 4vw, 3.8rem); color: var(--dark); line-height: 1.1; }
        .hero-content h2 { font-size: 1.9rem; color: #64748b; margin-bottom: 1.2rem; }
        .hero-content p { max-width: 600px; margin-bottom: 2rem; font-size: 1.05rem; }
        .social-icons { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
        .social-icons a { font-size: 1.6rem; color: var(--dark); transition: 0.3s; }
        .social-icons a:hover { color: var(--primary); transform: translateY(-3px); }
        .btn { display: inline-block; padding: 0.9rem 2rem; background: var(--primary); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: 0.3s; }
        .btn:hover { background: #1d4ed8; }
        .section { padding: 5rem 10%; }
        .bg-light { background-color: var(--light); }
        .section-title { text-align: center; font-size: 2.2rem; color: var(--dark); margin-bottom: 3rem; position: relative; }
        .section-title::after { content: ''; display: block; width: 50px; height: 4px; background: var(--primary); margin: 10px auto 0; border-radius: 2px; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; }
        .skill-card { background: white; padding: 1.5rem; text-align: center; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; transition: 0.3s; }
        .skill-card:hover { transform: translateY(-6px); }
        .skill-card i { font-size: 2.2rem; margin-bottom: 0.8rem; display: block; color: var(--primary); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 16px 40px rgba(32, 33, 36, 0.08); border: 1px solid #e2e8f0; transition: transform 0.3s ease; }
        .project-card:hover { transform: translateY(-6px); }
        .project-card h3 { margin-bottom: 0.8rem; color: var(--dark); }
        .project-card p { margin-bottom: 1rem; color: #475569; }
        .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .tag { background: #e0f2fe; color: #0369a1; padding: 0.5rem 0.8rem; border-radius: 999px; font-size: 0.9rem; }
        .project-links { display: flex; gap: 1rem; flex-wrap: wrap; }
        .project-links a { text-decoration: none; color: var(--primary); font-weight: 600; }
        .about-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center; }
        .about-content p { margin-bottom: 1.5rem; color: #475569; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }
        .stat-card { background: white; padding: 1.6rem; border-radius: 16px; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06); text-align: center; }
        .stat-card h4 { color: var(--primary); margin-bottom: 0.5rem; }
        .stat-card p { color: #475569; }
        .contact-card { max-width: 560px; margin: 0 auto; padding: 2rem; background: white; border-radius: 18px; box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
        .contact-card h3 { margin-bottom: 1rem; }
        .contact-card p { color: #475569; margin-bottom: 1.5rem; }
        .contact-card .contact-links { display: grid; gap: 1rem; }
        .contact-card a { color: var(--primary); text-decoration: none; font-weight: 600; }
        footer { padding: 2rem 10%; text-align: center; color: #64748b; }
        @media (max-width: 900px) {
          .hero { padding: 0 5%; }
          .section, .navbar { padding-left: 5%; padding-right: 5%; }
          .about-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .nav-links { flex-direction: column; gap: 1rem; }
        }
      </style>
    </head>
    <body>
      <header class="navbar">
        <div class="logo">Roshan <span>Jaiswal</span></div>
        <nav>
          <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section class="hero" id="home">
          <div class="hero-content">
            <h3>Full Stack Developer</h3>
            <h1>Building modern web experiences with JavaScript, Node.js & MongoDB.</h1>
            <h2>Hi, I’m Roshan — I design, build, and ship polished full-stack apps.</h2>
            <p>Experienced in web application development with a focus on responsive design, REST APIs, and performance-driven user experiences.</p>
            <div class="social-icons">
              <a href="https://github.com/mr-roshanjaiswal" target="_blank" rel="noreferrer"><i class="fab fa-github"></i></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><i class="fab fa-linkedin"></i></a>
              <a href="mailto:roshan@example.com"><i class="fas fa-envelope"></i></a>
            </div>
            <a class="btn" href="#projects">View Projects</a>
          </div>
        </section>

        <section class="section bg-light" id="skills">
          <h2 class="section-title">Core Skills</h2>
          <div class="skills-grid">
            <div class="skill-card"><i class="fab fa-js-square"></i><h4>JavaScript</h4></div>
            <div class="skill-card"><i class="fab fa-node-js"></i><h4>Node.js</h4></div>
            <div class="skill-card"><i class="fas fa-database"></i><h4>MongoDB</h4></div>
            <div class="skill-card"><i class="fab fa-react"></i><h4>React.js</h4></div>
            <div class="skill-card"><i class="fab fa-css3-alt"></i><h4>CSS / Tailwind</h4></div>
            <div class="skill-card"><i class="fas fa-code"></i><h4>REST APIs</h4></div>
          </div>
        </section>

        <section class="section" id="projects">
          <h2 class="section-title">Featured Projects</h2>
          <div class="projects-grid" id="projects-grid">
            <div class="project-card"><p>Loading projects…</p></div>
          </div>
        </section>

        <section class="section bg-light" id="about">
          <h2 class="section-title">About Me</h2>
          <div class="about-grid">
            <div class="about-content">
              <p>As a dedicated full-stack developer, I bring ideas to life using scalable web technologies. My strengths include building RESTful APIs, crafting user-friendly interfaces, and delivering polished projects for clients and employers.</p>
              <p>I enjoy collaborating across design and development teams, solving problems, and learning new tools that improve product quality and developer productivity.</p>
            </div>
            <div class="stats-grid">
              <div class="stat-card"><h4>3+</h4><p>Years experience</p></div>
              <div class="stat-card"><h4>15+</h4><p>Projects completed</p></div>
              <div class="stat-card"><h4>100%</h4><p>Client satisfaction</p></div>
            </div>
          </div>
        </section>

        <section class="section" id="contact">
          <h2 class="section-title">Contact</h2>
          <div class="contact-card">
            <h3>Let’s work together.</h3>
            <p>I'm available for freelance work, part-time roles, and internships. Reach out and let’s build something great.</p>
            <div class="contact-links">
              <a href="mailto:roshan@example.com">Email: roshan@example.com</a>
              <a href="https://github.com/mr-roshanjaiswal" target="_blank" rel="noreferrer">GitHub Profile</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Roshan Jaiswal. Built with Node.js, MongoDB and Express.</p>
      </footer>

      <script>
        async function loadProjects() {
          const container = document.getElementById('projects-grid');
          try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            container.innerHTML = projects.map(project => {
              const tags = project.technologies.map(function(tech) {
                return '<span class="tag">' + tech + '</span>';
              }).join('');
              return '<article class="project-card">' +
                '<h3>' + project.title + '</h3>' +
                '<p>' + project.description + '</p>' +
                '<div class="tags">' + tags + '</div>' +
                '<div class="project-links">' +
                '<a href="' + project.githubLink + '" target="_blank" rel="noreferrer">GitHub</a>' +
                '<a href="' + project.liveLink + '" target="_blank" rel="noreferrer">Live demo</a>' +
                '</div>' +
                '</article>';
            }).join('');
          } catch (error) {
            container.innerHTML = '<div class="project-card"><p>Unable to load projects right now.</p></div>';
            console.error('Failed to fetch projects:', error);
          }
        }
        loadProjects();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
