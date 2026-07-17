import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware with custom limits for social preview base64 images
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

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

  // --- Social Preview API Endpoints ---
  const SOCIAL_PREVIEW_FILE = path.join(process.cwd(), 'social-preview.json');

  function readSocialPreview() {
    try {
      if (fs.existsSync(SOCIAL_PREVIEW_FILE)) {
        return JSON.parse(fs.readFileSync(SOCIAL_PREVIEW_FILE, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading social preview config:', e);
    }
    return {
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      width: 1200,
      height: 630,
      type: 'image/jpeg',
      hasCustomImage: false
    };
  }

  // GET current social preview settings
  app.get('/api/social-preview', (req, res) => {
    res.json(readSocialPreview());
  });

  // POST upload/save social preview image
  app.post('/api/social-preview', (req, res) => {
    const { image, width, height, type } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    try {
      // Decode base64 image
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid image format' });
      }

      const mimeType = type || matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Determine extension from MIME type
      let ext = 'jpg';
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';

      const filename = `og-image.${ext}`;
      const filePath = path.join(process.cwd(), filename);

      // Delete any existing og-image.* files to avoid confusion
      ['og-image.jpg', 'og-image.png', 'og-image.webp'].forEach(f => {
        const p = path.join(process.cwd(), f);
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
        }
      });

      // Write the file to root directory
      fs.writeFileSync(filePath, buffer);

      // Write config
      const config = {
        imageUrl: `/og-image.jpg`, // Always served via `/og-image.jpg` endpoint
        width: width || 1200,
        height: height || 630,
        type: mimeType,
        hasCustomImage: true,
        filename: filename
      };

      fs.writeFileSync(SOCIAL_PREVIEW_FILE, JSON.stringify(config, null, 2), 'utf8');

      res.status(200).json(config);
    } catch (e) {
      console.error('Error saving social preview image:', e);
      res.status(500).json({ error: 'Failed to save social preview image' });
    }
  });

  // DELETE social preview image
  app.delete('/api/social-preview', (req, res) => {
    try {
      // Delete physical files
      ['og-image.jpg', 'og-image.png', 'og-image.webp'].forEach(f => {
        const p = path.join(process.cwd(), f);
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
        }
      });

      // Reset config file
      const defaultConfig = {
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        hasCustomImage: false
      };

      fs.writeFileSync(SOCIAL_PREVIEW_FILE, JSON.stringify(defaultConfig, null, 2), 'utf8');

      res.status(200).json(defaultConfig);
    } catch (e) {
      console.error('Error resetting social preview image:', e);
      res.status(500).json({ error: 'Failed to reset social preview image' });
    }
  });

  // GET the dynamic social preview image itself
  app.get('/og-image.jpg', (req, res) => {
    const config = readSocialPreview();
    let customImageName = 'og-image.jpg';
    if (config.hasCustomImage && config.filename) {
      customImageName = config.filename;
    }
    const customPath = path.join(process.cwd(), customImageName);
    if (config.hasCustomImage && fs.existsSync(customPath)) {
      res.sendFile(customPath);
    } else {
      res.redirect('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
    }
  });

  // Helper to inject social preview tags dynamically on served HTML
  function injectSocialMetadata(html: string, req: express.Request) {
    const config = readSocialPreview();
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    
    // Construct the absolute image URL
    let absoluteImageUrl = config.imageUrl;
    if (config.hasCustomImage) {
      absoluteImageUrl = `${protocol}://${host}/og-image.jpg`;
    }

    let resHtml = html;
    resHtml = resHtml.replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${absoluteImageUrl}"`
    );
    resHtml = resHtml.replace(
      /<meta name="twitter:image" content="[^"]*"/,
      `<meta name="twitter:image" content="${absoluteImageUrl}"`
    );
    resHtml = resHtml.replace(
      /<meta property="og:image:width" content="[^"]*"/,
      `<meta property="og:image:width" content="${config.width}"`
    );
    resHtml = resHtml.replace(
      /<meta property="og:image:height" content="[^"]*"/,
      `<meta property="og:image:height" content="${config.height}"`
    );
    resHtml = resHtml.replace(
      /<meta property="og:image:type" content="[^"]*"/,
      `<meta property="og:image:type" content="${config.type}"`
    );
    
    return resHtml;
  }

  // --- Serve Frontend ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    // In dev, intercept '/' to inject custom HTML metadata before Vite handles it
    app.get('/', async (req, res, next) => {
      try {
        const templatePath = path.join(process.cwd(), 'index.html');
        let html = fs.readFileSync(templatePath, 'utf8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        html = injectSocialMetadata(html, req);
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
      } catch (e) {
        next(e);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      const htmlPath = path.join(distPath, 'index.html');
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf8');
        html = injectSocialMetadata(html, req);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } else {
        res.status(404).send('Not Found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
