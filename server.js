/* ════════════════════════════════════════════════════════════════
   BALAJI CHITRARASU PORTFOLIO — Open-Source Node.js Backend Server
   Zero-dependency, pure Node.js REST API with file database.
   Runs standalone locally or on free cloud hosts (Render, Railway, Fly.io)
   ════════════════════════════════════════════════════════════════ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

/* Initial Default Database Structure */
const INITIAL_DB = {
  admin_credentials: {
    username: "Stealth@227",
    password: "Cleared@#9486",
    session_version: 1001
  },
  profile: {
    name: "Balaji Chitrarasu",
    avatar: "profile.jpg",
    logo: "logo.png",
    role: "AWS Cloud Engineer Intern",
    location: "Coimbatore, Tamil Nadu"
  },
  skills: [
    { id: 1, name: "AWS Cloud (EC2, S3, CloudFront, IAM, RDS, VPC, CloudWatch, CLI)", icon: "amazonaws", pct: 92 },
    { id: 2, name: "Network Architecture (VPC, Subnets, Route Tables, Security Groups)", icon: "cisco", pct: 88 },
    { id: 3, name: "Programming (Python, C, Java, JavaScript, REST APIs)", icon: "python", pct: 85 },
    { id: 4, name: "Databases & Storage (MySQL, Amazon RDS, SQL queries)", icon: "mysql", pct: 84 },
    { id: 5, name: "Embedded Systems & IoT (Arduino, IR, LDR, Solar, Boost Converter)", icon: "arduino", pct: 86 },
    { id: 6, name: "Dev Tools (Git, GitHub, Linux Bash, Postman, AWS CLI)", icon: "git", pct: 90 }
  ],
  projects: [
    {
      id: 1,
      title: "ZentroShift ERM App",
      category: "cloud",
      status: "completed",
      progress: 100,
      image: "project2.jpg",
      tags: "EC2, S3, RDS, CloudFront, VPC",
      summary: "Full-stack ERM system deployed across 6 AWS services with custom VPC, IAM roles, and CloudWatch monitoring.",
      details: "During my internship at ZenFuture Technologies (June–July 2026), I built and deployed ZentroShift — a full-stack ERM system across 6 AWS services: EC2 (server), S3 (assets), CloudFront (CDN), RDS (MySQL database), custom VPC (with public subnets, Internet Gateway, NAT Gateway, security groups), and CloudWatch (server health alarms). Features: 4-tier IAM role access control, location-based clock-in, attendance management, and REST APIs tested via Postman."
    },
    {
      id: 2,
      title: "Smart Solar Crossing",
      category: "embedded",
      status: "completed",
      progress: 100,
      image: "project3.jpg",
      tags: "Arduino, IR Sensor, Solar, LDR",
      summary: "Arduino-powered pedestrian crossing alert system with solar panel, boost converter battery management, IR & LDR sensors.",
      details: "Designed and built a solar-powered zebra crossing alert system. Hardware: Arduino Uno, IR sensors (pedestrian detection), LDR (ambient light sensing), solar panel, boost converter (battery charge management), Li-ion battery pack, LEDs, and a buzzer. When IR sensors detect an approaching pedestrian in low-light conditions (LDR threshold), the system triggers audio-visual warnings for drivers while the solar boost converter keeps the battery charged."
    },
    {
      id: 3,
      title: "Developer Portfolio",
      category: "web",
      status: "ongoing",
      progress: 85,
      image: "project1.jpg",
      tags: "HTML5, CSS3, JavaScript, Node.js",
      summary: "Responsive portfolio with full SEO, JSON-LD schema, admin CMS panel, and tech blog.",
      details: "Built a fully responsive developer portfolio with clean UI, JSON-LD structured data, Open Graph meta tags, GitHub Pages deployment, an admin CMS panel (REST API & localStorage-backed CRUD for projects, certs, blog posts), and a tech blog. Stack: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript, Node.js REST API."
    }
  ],
  certs: [
    {
      id: 1,
      title: "AWS Cloud Engineer Intern",
      issuer: "ZenFuture Technologies",
      status: "ZF-INTERN-0026 · June–July 2026",
      badge: "badge-teal",
      badgeText: "☁️ Production Certified",
      desc: "Completed hands-on AWS Cloud internship. Deployed ZentroShift full-stack ERM app on EC2, S3, RDS, CloudFront, VPC, and CloudWatch with 4-tier IAM access control.",
      image: "cert1.jpg"
    },
    {
      id: 2,
      title: "AI Fluency Frameworks",
      issuer: "Anthropic",
      status: "Certified · 2025",
      badge: "badge-violet",
      badgeText: "🤖 Anthropic Certified",
      desc: "Certified by Anthropic in AI frameworks, LLM system architecture, prompt engineering, and AI safety foundations.",
      image: "cert1.jpg"
    },
    {
      id: 3,
      title: "Industry 4.0 & IIoT",
      issuer: "NPTEL · IIT Kharagpur",
      status: "Certified · 2024",
      badge: "badge-teal",
      badgeText: "✅ Govt. of India Verified",
      desc: "Completed 12-week proctored NPTEL course on Industrial IoT funded by the Ministry of Education, Government of India.",
      image: "cert1.jpg"
    },
    {
      id: 4,
      title: "Software Engineer",
      issuer: "HackerRank",
      status: "Role Certification (2024)",
      badge: "badge-amber",
      badgeText: "⭐ Role Certified",
      desc: "Passed HackerRank Software Engineer role certification — covering algorithms, data structures, and software development.",
      image: "cert1.jpg"
    }
  ],
  blog: [],
  messages: [],
  analytics: {
    pageViews: 1280,
    lastHit: new Date().toISOString()
  }
};

/* Database File Helper */
function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DB;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

/* Parse JSON Request Body Helper */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}

/* Enable CORS Headers */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/* HTTP Server Handler */
const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = req.url.split('?')[0];
  const db = getDB();

  /* ──────────────── REST API ROUTER ──────────────── */

  // Health Check
  if (url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', database: 'connected', time: new Date().toISOString() }));
  }

  // Profile API
  if (url === '/api/profile') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(db.profile));
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await parseBody(req);
      db.profile = { ...db.profile, ...body };
      saveDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, profile: db.profile }));
    }
  }

  // Skills API
  if (url === '/api/skills') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(db.skills));
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await parseBody(req);
      if (Array.isArray(body)) {
        db.skills = body;
        saveDB(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, skills: db.skills }));
      }
    }
  }

  // Projects API
  if (url === '/api/projects') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(db.projects));
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const newProj = { id: Date.now(), ...body };
      db.projects.push(newProj);
      saveDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, project: newProj }));
    }
    if (req.method === 'PUT') {
      const body = await parseBody(req);
      const idx = db.projects.findIndex(p => p.id == body.id);
      if (idx !== -1) {
        db.projects[idx] = { ...db.projects[idx], ...body };
        saveDB(db);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, project: db.projects[idx] }));
      }
    }
  }

  if (url.startsWith('/api/projects/') && req.method === 'DELETE') {
    const id = url.split('/')[3];
    db.projects = db.projects.filter(p => p.id != id);
    saveDB(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, deletedId: id }));
  }

  // Unified CMS Snapshot API
  if (url === '/api/cms/sync' && (req.method === 'POST' || req.method === 'PUT')) {
    const body = await parseBody(req);
    if (body && typeof body === 'object') {
      if (body.profile) db.profile = { ...db.profile, ...body.profile };
      if (body.admin_credentials) db.admin_credentials = body.admin_credentials;
      if (body.security_lockout) db.security_lockout = body.security_lockout;
      if (Array.isArray(body.certs)) db.certs = body.certs;
      if (Array.isArray(body.projects)) db.projects = body.projects;
      if (Array.isArray(body.skills)) db.skills = body.skills;
      if (Array.isArray(body.events)) db.events = body.events;
      if (Array.isArray(body.timeline)) db.timeline = body.timeline;
      if (Array.isArray(body.blogs)) db.blog = body.blogs;
      saveDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, database: db }));
    }
  }

  if (url === '/api/cms/all' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(db));
  }

  // Certifications API
  if (url === '/api/certs/all' && (req.method === 'POST' || req.method === 'PUT')) {
    const body = await parseBody(req);
    if (Array.isArray(body)) {
      db.certs = body;
      saveDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, certs: db.certs }));
    }
  }

  if (url === '/api/certs') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(db.certs));
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await parseBody(req);
      const idx = db.certs.findIndex(c => String(c.id) === String(body.id));
      if (idx !== -1) {
        db.certs[idx] = { ...db.certs[idx], ...body };
      } else {
        db.certs.push({ id: body.id || Date.now(), ...body });
      }
      saveDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, certs: db.certs }));
    }
  }

  if (url.startsWith('/api/certs/') && req.method === 'DELETE') {
    const id = url.split('/')[3];
    db.certs = db.certs.filter(c => String(c.id) !== String(id));
    saveDB(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, deletedId: id }));
  }

  // Messages API (Contact Form)
  if (url === '/api/messages') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(db.messages));
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const msg = { id: Date.now(), time: new Date().toISOString(), ...body };
      db.messages.push(msg);
      saveDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, message: 'Message saved to database!' }));
    }
  }

  // Analytics Hit API
  if (url === '/api/analytics/hit' && req.method === 'POST') {
    db.analytics.pageViews = (db.analytics.pageViews || 1280) + 1;
    db.analytics.lastHit = new Date().toISOString();
    saveDB(db);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, pageViews: db.analytics.pageViews }));
  }

  // Serve static files if requested
  let filePath = path.join(__dirname, url === '/' ? 'index.html' : url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(filePath).pipe(res);
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 Balaji Chitrarasu Portfolio Open-Source Backend Running!`);
  console.log(`📡 Local Server URL: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint:  http://localhost:${PORT}/api/health`);
  console.log(`💾 Database File:   ${DB_FILE}\n`);
});
