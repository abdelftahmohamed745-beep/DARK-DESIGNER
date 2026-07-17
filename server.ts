import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // Database files paths
  const DESIGNS_FILE = path.join(process.cwd(), 'designs.json');
  const INQUIRIES_FILE = path.join(process.cwd(), 'inquiries.json');

  // Load / Save helpers
  function readDesigns() {
    try {
      if (fs.existsSync(DESIGNS_FILE)) {
        const content = fs.readFileSync(DESIGNS_FILE, 'utf8');
        return JSON.parse(content);
      }
    } catch (e) {
      console.error('Error reading designs database:', e);
    }
    return [];
  }

  function writeDesigns(designs: any[]) {
    try {
      fs.writeFileSync(DESIGNS_FILE, JSON.stringify(designs, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing designs database:', e);
    }
  }

  function readInquiries() {
    try {
      if (fs.existsSync(INQUIRIES_FILE)) {
        const content = fs.readFileSync(INQUIRIES_FILE, 'utf8');
        return JSON.parse(content);
      }
    } catch (e) {
      console.error('Error reading inquiries database:', e);
    }
    return [
      {
        id: 'inquiry-1',
        designId: 'design-2',
        designTitle: 'Fintech Mobile Banking Dashboard',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sjenkins@fintechlabs.io',
        customerCompany: 'Fintech Labs',
        message: 'Hi! We loved your banking dashboard concept. We are building a retail investing platform for Gen-Z and would love to hire you to adapt this exact layout to support fractional share trading flows. Are you available for a 4-week freelance contract starting next month?',
        budget: '$5,000+',
        createdAt: '2026-07-16T15:20:00.000Z',
        status: 'pending'
      },
      {
        id: 'inquiry-2',
        designId: 'design-3',
        designTitle: 'Nectar Organics - Brand Identity & Packaging',
        customerName: 'Derrick Vance',
        customerEmail: 'dvance@pinnaclecosmetics.com',
        customerCompany: 'Pinnacle Cosmetics',
        message: 'Greetings! Your packaging design is absolutely stunning. We are launching a new organic body-wash line and would love to license your identity package. Could you provide details on what source files are included in the $299 license, and if you offer custom brand guidelines customization services?',
        budget: '$2,000 - $5,000',
        createdAt: '2026-07-17T01:10:00.000Z',
        status: 'reviewed'
      }
    ];
  }

  function writeInquiries(inquiries: any[]) {
    try {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing inquiries database:', e);
    }
  }

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // GET all designs
  app.get('/api/designs', (req, res) => {
    res.json(readDesigns());
  });

  // POST new design
  app.post('/api/designs', (req, res) => {
    const newDesign = req.body;
    const designs = readDesigns();
    designs.unshift(newDesign);
    writeDesigns(designs);
    res.status(201).json(newDesign);
  });

  // DELETE design
  app.delete('/api/designs/:id', (req, res) => {
    const { id } = req.params;
    let designs = readDesigns();
    designs = designs.filter((d: any) => d.id !== id);
    writeDesigns(designs);
    res.json({ success: true });
  });

  // UPDATE design likes
  app.put('/api/designs/:id/like', (req, res) => {
    const { id } = req.params;
    const { isLiked } = req.body;
    const designs = readDesigns();
    const updated = designs.map((d: any) => {
      if (d.id === id) {
        return {
          ...d,
          likes: isLiked ? d.likes + 1 : Math.max(0, d.likes - 1)
        };
      }
      return d;
    });
    writeDesigns(updated);
    res.json(updated.find((d: any) => d.id === id) || { success: true });
  });

  // UPDATE design views
  app.put('/api/designs/:id/view', (req, res) => {
    const { id } = req.params;
    const designs = readDesigns();
    const updated = designs.map((d: any) => {
      if (d.id === id) {
        return { ...d, views: d.views + 1 };
      }
      return d;
    });
    writeDesigns(updated);
    res.json(updated.find((d: any) => d.id === id) || { success: true });
  });

  // GET all inquiries
  app.get('/api/inquiries', (req, res) => {
    res.json(readInquiries());
  });

  // POST new inquiry
  app.post('/api/inquiries', (req, res) => {
    const newInquiry = req.body;
    const inquiries = readInquiries();
    inquiries.unshift(newInquiry);
    writeInquiries(inquiries);
    res.status(201).json(newInquiry);
  });

  // UPDATE inquiry status
  app.put('/api/inquiries/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const inquiries = readInquiries();
    const updated = inquiries.map((inq: any) => {
      if (inq.id === id) {
        return { ...inq, status };
      }
      return inq;
    });
    writeInquiries(updated);
    res.json(updated.find((inq: any) => inq.id === id) || { success: true });
  });

  // DELETE inquiry
  app.delete('/api/inquiries/:id', (req, res) => {
    const { id } = req.params;
    let inquiries = readInquiries();
    inquiries = inquiries.filter((inq: any) => inq.id !== id);
    writeInquiries(inquiries);
    res.json({ success: true });
  });

  // --- Serve Frontend ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
