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
      const idx = saved.findIndex(p => p.id === projectObj.id);
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
  }
};

/* Auto-check backend on script load */
window.PortfolioAPI.checkHealth();
