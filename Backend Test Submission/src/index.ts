import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// @ts-ignore: Importing JS module with types
import { log } from '../../Logging Middleware/dist/index';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// In-memory store for URLs and stats
const urlStore: Record<string, any> = {};
const statsStore: Record<string, any> = {};

// Replace with your actual access token after authentication
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJraW1yMjJjc0BjbXJpdC5hYy5pbiIsImV4cCI6MTc1NjA5NTc1NywiaWF0IjoxNzU2MDk0ODU3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzlhMWM2ZTAtYTU2Yy00YmY5LWFlMzktMTgzYTdiYzhmZGVhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2lyYW4gcmFqIG0gciIsInN1YiI6IjMyOWM3OGI1LWVlOGEtNDY1ZC1hNWI0LWQ0ZjAwYmVkYWIzYyJ9LCJlbWFpbCI6ImtpbXIyMmNzQGNtcml0LmFjLmluIiwibmFtZSI6ImtpcmFuIHJhaiBtIHIiLCJyb2xsTm8iOiIxY3IyMmNzMDgyIiwiYWNjZXNzQ29kZSI6InlVVlFYSyIsImNsaWVudElEIjoiMzI5Yzc4YjUtZWU4YS00NjVkLWE1YjQtZDRmMDBiZWRhYjNjIiwiY2xpZW50U2VjcmV0IjoiYlNrTVBwQnlHZWtacWNNZSJ9.8qBACwEAT903Dqc00oBp1azXLw4CKpkV46TV2pWOErg';

// Helper to generate a unique shortcode
function generateShortcode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /shorturls - Create a short URL
import { Request, Response } from 'express';

app.post('/shorturls', async (req: Request, res: Response) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || typeof url !== 'string') {
    await log({ stack: 'backend', level: 'error', package: 'handler', message: 'Invalid URL input', accessToken: ACCESS_TOKEN });
    return res.status(400).json({ error: 'Invalid URL' });
  }
  let code = shortcode;
  if (code) {
    if (typeof code !== 'string' || !/^[a-zA-Z0-9]{3,20}$/.test(code) || urlStore[code]) {
      await log({ stack: 'backend', level: 'error', package: 'handler', message: 'Shortcode unavailable or invalid', accessToken: ACCESS_TOKEN });
      return res.status(409).json({ error: 'Shortcode unavailable or invalid' });
    }
  } else {
    do {
      code = generateShortcode();
    } while (urlStore[code]);
  }
  const expiry = new Date(Date.now() + (validity || 30) * 60000).toISOString();
  urlStore[code] = { url, expiry, created: new Date().toISOString() };
  statsStore[code] = { clicks: 0, details: [] };
  await log({ stack: 'backend', level: 'info', package: 'handler', message: `Short URL created for ${url} with code ${code}`, accessToken: ACCESS_TOKEN });
  res.status(201).json({ shortLink: `${req.protocol}://${req.get('host')}/${code}`, expiry });
});

// GET /shorturls/:shortcode - Get stats
app.get('/shorturls/:shortcode', async (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const urlData = urlStore[shortcode];
  if (!urlData) {
    await log({ stack: 'backend', level: 'error', package: 'handler', message: 'Shortcode not found', accessToken: ACCESS_TOKEN });
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  const stats = statsStore[shortcode];
  res.json({
    url: urlData.url,
    created: urlData.created,
    expiry: urlData.expiry,
    clicks: stats.clicks,
    details: stats.details
  });
});

// GET /:shortcode - Redirect
app.get('/:shortcode', async (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const urlData = urlStore[shortcode];
  if (!urlData) {
    await log({ stack: 'backend', level: 'error', package: 'handler', message: 'Shortcode not found for redirect', accessToken: ACCESS_TOKEN });
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  if (new Date(urlData.expiry) < new Date()) {
    await log({ stack: 'backend', level: 'warn', package: 'handler', message: 'Shortcode expired', accessToken: ACCESS_TOKEN });
    return res.status(410).json({ error: 'Shortcode expired' });
  }
  // Log click details
  const stats = statsStore[shortcode];
  stats.clicks++;
  stats.details.push({
    timestamp: new Date().toISOString(),
    referrer: req.get('referer') || '',
    ip: req.ip
  });
  await log({ stack: 'backend', level: 'info', package: 'handler', message: `Redirected to ${urlData.url}`, accessToken: ACCESS_TOKEN });
  res.redirect(urlData.url);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`URL Shortener service running on port ${PORT}`);
});
