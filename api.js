/* ════════════════════════════════════════════════════════════════
   BALAJI CHITRARASU PORTFOLIO — Open-Source Client API Helper (api.js)
   Connects index.html, script.js, and admin.html to the live Node.js REST API
   with automatic localStorage fallback when offline!
   ════════════════════════════════════════════════════════════════ */

const RENDER_BACKEND_URL = 'https://balaji-portfolio-backend.onrender.com';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : (window.PORTFOLIO_API_URL || RENDER_BACKEND_URL);

window.PortfolioAPI = {
  isOnline: false,

  /* Check Backend Health Status (Tests root / or /api/health) */
  async checkHealth(retries = 1) {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        let res = await fetch(`${API_BASE}/`, { method: 'GET', signal: controller.signal });
        if (!res.ok) res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          this.isOnline = true;
          return true;
        }
      } catch (e) {}
      if (i < retries) await new Promise(r => setTimeout(r, 800));
    }
    this.isOnline = false;
    return false;
  },

  /* Get Profile */
  async getProfile() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/profile`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // LocalStorage Fallback
    return {
      name: localStorage.getItem('custom_profile_name') || 'Balaji Chitrarasu',
      avatar: localStorage.getItem('custom_profile_avatar') || 'profile.jpg'
    };
  },

  /* Get Skills */
  async getSkills() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/skills`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // LocalStorage Fallback
    try {
      const saved = localStorage.getItem('custom_skills');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  },

  /* Save Skills */
  async saveSkills(skillsArray) {
    localStorage.setItem('custom_skills', JSON.stringify(skillsArray));
    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skillsArray)
        });
      } catch (e) {}
    }
  },

  /* Get Projects */
  async getProjects() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    // LocalStorage Fallback
    try {
      const saved = localStorage.getItem('custom_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  },

  /* Save / Create Project */
  async saveProject(projectObj) {
    // Save to local storage first
    try {
      let saved = JSON.parse(localStorage.getItem('custom_projects') || '[]');
      const idx = saved.findIndex(p => String(p.id) === String(projectObj.id));
      if (idx !== -1) saved[idx] = projectObj;
      else saved.push(projectObj);
      localStorage.setItem('custom_projects', JSON.stringify(saved));
    } catch (e) {}

    // Save to live backend API
    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/projects`, {
          method: projectObj.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectObj)
        });
      } catch (e) {}
    }
  },

  /* Get Certifications from Cloud API */
  async getCerts() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/certs`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch (e) {}
    }
    try {
      const saved = localStorage.getItem('custom_certs');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  /* Save / Create Single Certification */
  async saveCert(certObj) {
    // Save to local storage first
    try {
      let saved = JSON.parse(localStorage.getItem('custom_certs') || '[]');
      const idx = saved.findIndex(c => String(c.id) === String(certObj.id));
      if (idx !== -1) saved[idx] = certObj;
      else saved.push(certObj);
      localStorage.setItem('custom_certs', JSON.stringify(saved));
    } catch (e) {}

    // Save to live backend API
    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/certs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certObj)
        });
      } catch (e) {}
    }
  },

  /* Save Full Certifications List (Supports Delete & Clear All) */
  async saveAllCerts(certsArray) {
    try {
      localStorage.setItem('custom_certs', JSON.stringify(certsArray));
    } catch (e) {}
    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/certs/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certsArray)
        });
      } catch (e) {}
    }
    await this.syncGlobalCMSData();
  },

  /* Delete Certification from Cloud Backend API */
  async deleteCertCloud(id) {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('custom_certs') || '[]');
      saved = saved.filter(c => String(c.id) !== String(id));
      localStorage.setItem('custom_certs', JSON.stringify(saved));
    } catch (e) {}

    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/certs/${id}`, { method: 'DELETE' });
        await fetch(`${API_BASE}/api/certs/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved)
        });
      } catch (e) {}
    }
    await this.syncGlobalCMSData();
  },

  /* Delete Project from Cloud Backend API */
  async deleteProjCloud(id) {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('custom_projects') || '[]');
      saved = saved.filter(p => String(p.id) !== String(id));
      localStorage.setItem('custom_projects', JSON.stringify(saved));
    } catch (e) {}

    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE' });
        await fetch(`${API_BASE}/api/projects/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saved)
        });
      } catch (e) {}
    }
    await this.syncGlobalCMSData();
  },

  /* Get Skills from Cloud API */
  async getSkills() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/skills`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch (e) {}
    }
    try {
      const saved = localStorage.getItem('custom_skills');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return null;
  },

  /* Save Skills */
  async saveSkills(skillsArray) {
    try {
      localStorage.setItem('custom_skills', JSON.stringify(skillsArray));
    } catch (e) {}
    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skillsArray)
        });
      } catch (e) {}
    }
  },

  /* Send Contact Message */
  async sendMessage(name, email, message) {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return { success: true, fallback: true };
  },

  /* Deep Forensic IP, Network, ISP & Geo-Location Tracking Engine */
  async getIntruderForensics() {
    let geo = { ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown', org: 'Unknown ISP', location: 'Unknown' };
    try {
      const res = await fetch('https://ipapi.co/json/').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        geo.ip = data.ip || 'Unknown';
        geo.city = data.city || 'Unknown';
        geo.region = data.region || 'Unknown';
        geo.country = data.country_name || 'Unknown';
        geo.org = data.org || data.asn || 'Unknown ISP';
        geo.location = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''} (Lat: ${data.latitude || ''}, Lon: ${data.longitude || ''})`;
      } else {
        const ipRes = await fetch('https://api.ipify.org?format=json').catch(() => null);
        if (ipRes && ipRes.ok) {
          const ipData = await ipRes.json();
          geo.ip = ipData.ip || 'Unknown';
        }
      }
    } catch(e) {}
    return geo;
  },

  /* Send Real Email Notification to Master Admin's Gmail Inbox */
  async sendRealEmail(subject, message) {
    try {
      // 1. Post to FormSubmit.co Secure Token Endpoint (Direct Clean Email to Gmail)
      fetch('https://formsubmit.co/ajax/3178cfbabf11bdca35d291fbc399bd13', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'box',
          _captcha: 'false',
          _autorespond: 'Security Alert Dispatch Confirmation',
          security_alert_title: subject,
          alert_content: message
        })
      }).catch(function() {});

      // 2. Post to Web3Forms Dispatch Endpoint
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b01c7d2a-89a4-4f01-b6f7-c502b70f074d',
          email: 'balajichitrarasu07@gmail.com',
          subject: subject,
          message: message,
          from_name: 'Balaji Portfolio Security Bot'
        })
      }).catch(function() {});

      // 3. Save to Cloud Inbox REST API
      this.sendMessage(subject, 'balajichitrarasu07@gmail.com', message);
    } catch(e) {}
  },

  /* Record Page View Hit */
  async recordHit() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/analytics/hit`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
  },

  /* Global Access Logs */
  async syncAccessLog(logEntry) {
    try {
      let logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
      if (!Array.isArray(logs)) logs = [];
      
      const existingIdx = logs.findIndex(l => l.ip === logEntry.ip && l.timestamp === logEntry.timestamp);
      if (existingIdx === -1) {
        logs.unshift(logEntry);
        if (logs.length > 50) logs.pop();
        localStorage.setItem('admin_access_logs', JSON.stringify(logs));
      }
    } catch (e) {}
  },

  async fetchGlobalAccessLogs() {
    return JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
  },

  /* ══ UNIFIED REAL-TIME CLOUD DATABASE CONTROLLER ══ */
  async syncGlobalCMSData(overrideObj) {
    let fullSnapshot = {
      profile: {
        name: localStorage.getItem('custom_profile_name') || 'Balaji Chitrarasu',
        role: localStorage.getItem('custom_profile_role') || 'AWS Cloud Engineer Intern & B.E. ECE Student',
        avatar: localStorage.getItem('custom_profile_avatar') || 'profile.jpg',
        location: localStorage.getItem('custom_profile_location') || 'Coimbatore, Tamil Nadu, India',
        resumePdf: localStorage.getItem('custom_resume_pdf') || 'resume.pdf?v=58.0',
        linkedin: localStorage.getItem('custom_linkedin_url') || 'https://www.linkedin.com/in/balajichitrarasu',
        github: localStorage.getItem('custom_github_url') || 'https://github.com/balajichitrarasu',
        email: localStorage.getItem('custom_email_url') || 'balajichitrarasu07@gmail.com',
        phone: localStorage.getItem('custom_phone_url') || '+91 76396 83223',
        website: localStorage.getItem('custom_website_url') || 'https://balajichitrarasu.github.io'
      },
      admin_credentials: {
        username: localStorage.getItem('custom_admin_user') || 'Stealth@227',
        password: localStorage.getItem('custom_admin_pass') || 'Cleared@#9486'
      },
      security_lockout: {
        attempts: parseInt(localStorage.getItem('failed_login_attempts') || '0'),
        lockoutUntil: parseInt(localStorage.getItem('login_lockout_until') || '0'),
        isPerm: localStorage.getItem('login_permanently_locked') === 'true'
      },
      certs: JSON.parse(localStorage.getItem('custom_certs') || '[]'),
      projects: JSON.parse(localStorage.getItem('custom_projects') || '[]'),
      skills: JSON.parse(localStorage.getItem('custom_skills') || '[]'),
      events: JSON.parse(localStorage.getItem('custom_events') || '[]'),
      timeline: JSON.parse(localStorage.getItem('custom_timeline') || '[]'),
      blogs: JSON.parse(localStorage.getItem('custom_blog_posts') || '[]'),
      timestamp: new Date().toISOString()
    };

    if (overrideObj && typeof overrideObj === 'object') {
      fullSnapshot = { ...fullSnapshot, ...overrideObj };
    }

    try {
      localStorage.setItem('custom_portfolio_database_v1', JSON.stringify(fullSnapshot));
    } catch(e) {}

    if (await this.checkHealth()) {
      try {
        await fetch(`${API_BASE}/api/cms/sync?_t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store' },
          body: JSON.stringify(fullSnapshot)
        });
      } catch (e) {}
    }
    return true;
  },

  async fetchGlobalCMSData() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/cms/all?_t=${Date.now()}`, {
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') return data;
        }
      } catch (e) {}
    }
    try {
      const saved = localStorage.getItem('custom_portfolio_database_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }
};
