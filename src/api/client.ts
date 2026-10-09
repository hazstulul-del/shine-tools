// Client API interface to proxy backend

export interface NFTokenResponse {
  success?: boolean;
  token?: string;
  expired?: string;
  country?: string;
  plan?: string;
  links?: {
    pc?: string;
    android?: string;
    tv6?: string;
    tv8?: string;
  };
  generatedAt?: string;
  error?: string;
  message?: string;
}

export interface ProxyResponse<T = any> {
  status?: boolean;
  success?: boolean;
  source?: string;
  result?: T;
  message?: string;
  error?: string;
}

export const apiClient = {
  // ==========================================
  // CORE MODULES (STATUS, PREMIUM, NFTOKEN, SHINE MAIL)
  // ==========================================

  // Server Status & Live Ping
  async getServerStatus() {
    const res = await fetch('/api/proxy/status');
    return await res.json();
  },

  async pingServer(): Promise<{ pingMs: number; status: boolean; data: any }> {
    const start = performance.now();
    try {
      const res = await fetch('/api/proxy/ping');
      const data = await res.json();
      const end = performance.now();
      return { pingMs: Math.round(end - start), status: true, data };
    } catch (e: any) {
      const end = performance.now();
      return { pingMs: Math.round(end - start), status: false, data: null };
    }
  },

  // Alight Motion Send Link
  async sendAlightMotionLink(email: string) {
    const res = await fetch('/api/proxy/alightmotion/send-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  },

  // Alight Motion Verify Link
  async verifyAlightMotionLink(email: string, link: string) {
    const res = await fetch('/api/proxy/alightmotion/verify-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, link, magicLink: link }),
    });
    return await res.json();
  },

  // NFTOKEN Generate
  async generateNFToken(): Promise<NFTokenResponse> {
    const res = await fetch('/api/proxy/nftoken/generate');
    return await res.json();
  },

  // NFTOKEN Convert Cookie
  async convertNFTokenCookie(cookie: string) {
    const res = await fetch('/api/proxy/nftoken/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie }),
    });
    return await res.json();
  },

  // SHINE MAIL API
  async createShineMail(sid_token?: string): Promise<{ success: boolean; email: string; sid_token: string; alias?: string; timestamp?: number; isFallback?: boolean }> {
    const res = await fetch('/api/proxy/shinemail/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid_token }),
    });
    return await res.json();
  },

  async setShineMailUser(username: string, sid_token?: string, site?: string): Promise<{ success: boolean; email: string; sid_token: string; alias?: string; error?: string }> {
    const res = await fetch('/api/proxy/shinemail/set-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, sid_token, site }),
    });
    return await res.json();
  },

  async checkShineMailInbox(sid_token: string, seq: number = 0): Promise<{ success: boolean; emails: any[]; count: number; email: string; sid_token: string; error?: string }> {
    const res = await fetch('/api/proxy/shinemail/inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid_token, seq }),
    });
    return await res.json();
  },

  async getShineMailMessage(sid_token: string, mail_id: number): Promise<{ success: boolean; mail?: any; error?: string }> {
    const res = await fetch('/api/proxy/shinemail/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid_token, mail_id }),
    });
    return await res.json();
  },

  async getShineMailDomains(): Promise<{ success: boolean; domains: string[] }> {
    const res = await fetch('/api/proxy/shinemail/domains');
    return await res.json();
  },
};

