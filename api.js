/* ════════════════════════════════════════════════════════════════
   BALAJI CHITRARASU PORTFOLIO — Open-Source Client API Helper (api.js)
   Connects index.html, script.js, and admin.html to the live Node.js REST API
   with automatic localStorage fallback when offline!
   ════════════════════════════════════════════════════════════════ */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : (window.PORTFOLIO_API_URL || 'http://localhost:3000');

window.PortfolioAPI = {
  isOnline: false,

  /* Check Backend Health Status */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
      if (res.ok) {
        this.isOnline = true;
        return true;
      }
    } catch (e) {
      this.isOnline = false;
    }
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

  /* Save / Create Certification */
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

  /* Record Page View Hit */
  async recordHit() {
    if (await this.checkHealth()) {
      try {
        const res = await fetch(`${API_BASE}/api/analytics/hit`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
  },

  /* Global Cloud Access Logs Sync across all devices */
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

      // Sync to Remote Key-Value Cloud Store so laptop & all devices see it
      const key = 'balaji_admin_ip_logs_2026';
      const endpoint = `https://keyvalue.imsky.org/set/${key}/${encodeURIComponent(JSON.stringify(logs.slice(0, 20)))}`;
      fetch(endpoint, { method: 'POST' }).catch(() => {});
    } catch (e) {}
  },

  async fetchGlobalAccessLogs() {
    try {
      const key = 'balaji_admin_ip_logs_2026';
      const res = await fetch(`https://keyvalue.imsky.org/get/${key}`);
      if (res.ok) {
        const text = await res.text();
        if (text && text !== 'null') {
          const remoteLogs = JSON.parse(text);
          if (Array.isArray(remoteLogs) && remoteLogs.length > 0) {
            let localLogs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
            if (!Array.isArray(localLogs)) localLogs = [];
            
            const map = new Map();
            localLogs.forEach(l => map.set(l.id || (l.ip + l.timestamp), l));
            remoteLogs.forEach(l => map.set(l.id || (l.ip + l.timestamp), l));

            const merged = Array.from(map.values()).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
            localStorage.setItem('admin_access_logs', JSON.stringify(merged.slice(0, 50)));
            return merged.slice(0, 50);
          }
        }
      }
    } catch (e) {}
    return JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
  },

  /* ══ GLOBAL CLOUD BACKEND DATABASE SYNC ══ */
  async syncGlobalCMSData() {
    try {
      const db = {
        avatar: localStorage.getItem('custom_profile_avatar') || 'profile.jpg',
        name: localStorage.getItem('custom_profile_name') || 'Balaji Chitrarasu',
        role: localStorage.getItem('custom_profile_role') || 'AWS Cloud Engineer Intern & B.E. ECE Student',
        location: localStorage.getItem('custom_profile_location') || 'Coimbatore, Tamil Nadu, India',
        certs: JSON.parse(localStorage.getItem('custom_certs') || '[]'),
        projects: JSON.parse(localStorage.getItem('custom_projects') || '[]'),
        skills: JSON.parse(localStorage.getItem('custom_skills') || '[]'),
        updatedAt: new Date().toISOString()
      };
      
      const key = 'balaji_cms_global_db_v2';
      await fetch(`https://keyvalue.imsky.org/set/${key}/${encodeURIComponent(JSON.stringify(db))}`, { method: 'POST' });
      return true;
    } catch (e) {
      return false;
    }
  },

  async fetchGlobalCMSData() {
    try {
      const key = 'balaji_cms_global_db_v2';
      const res = await fetch(`https://keyvalue.imsky.org/get/${key}`);
      if (res.ok) {
        const text = await res.text();
        if (text && text !== 'null') {
          const cloudData = JSON.parse(text);
          if (cloudData && typeof cloudData === 'object') {
            if (cloudData.avatar) localStorage.setItem('custom_profile_avatar', cloudData.avatar);
            if (cloudData.name) localStorage.setItem('custom_profile_name', cloudData.name);
            if (cloudData.role) localStorage.setItem('custom_profile_role', cloudData.role);
            if (cloudData.location) localStorage.setItem('custom_profile_location', cloudData.location);
            if (Array.isArray(cloudData.certs) && cloudData.certs.length > 0) {
              localStorage.setItem('custom_certs', JSON.stringify(cloudData.certs));
            }
            if (Array.isArray(cloudData.projects) && cloudData.projects.length > 0) {
              localStorage.setItem('custom_projects', JSON.stringify(cloudData.projects));
            }
            if (Array.isArray(cloudData.skills) && cloudData.skills.length > 0) {
              localStorage.setItem('custom_skills', JSON.stringify(cloudData.skills));
            }
            return cloudData;
          }
        }
      }
    } catch (e) {}
    return null;
  }
};

/* Auto-check backend on script load */
window.PortfolioAPI.checkHealth();
