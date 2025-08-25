import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Divider, Alert } from '@mui/material';
import { addShortcodeToSession } from './sessionUtils';

const API_BASE = '';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState<number | ''>('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState<{ shortLink: string; expiry: string } | null>(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [statsCode, setStatsCode] = useState('');
  const [statsError, setStatsError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/shorturls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, validity: validity ? Number(validity) : undefined, shortcode: shortcode || undefined })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create short URL');
        return;
      }
      const data = await res.json();
      setResult(data);
      // Extract shortcode from the shortLink URL
      const match = data.shortLink.match(/\/([^\/]+)$/);
      if (match) {
        addShortcodeToSession(match[1]);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleStats = async () => {
    setStats(null);
    setStatsError('');
    try {
      const res = await fetch(`${API_BASE}/shorturls/${statsCode}`);
      if (!res.ok) {
        const data = await res.json();
        setStatsError(data.error || 'Failed to fetch stats');
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStatsError('Network error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>URL Shortener</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Long URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Validity (minutes)"
            value={validity}
            onChange={e => setValidity(e.target.value === '' ? '' : Number(e.target.value))}
            type="number"
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Custom Shortcode (optional)"
            value={shortcode}
            onChange={e => setShortcode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Shorten</Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="success">
              <div>Short Link: <a href={result.shortLink} target="_blank" rel="noopener noreferrer">{result.shortLink}</a></div>
              <div>Expiry: {new Date(result.expiry).toLocaleString()}</div>
            </Alert>
          </Box>
        )}
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Get Short URL Stats</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Shortcode"
            value={statsCode}
            onChange={e => setStatsCode(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleStats}>Get Stats</Button>
        </Box>
        {statsError && <Alert severity="error">{statsError}</Alert>}
        {stats && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography>Original URL: {stats.url}</Typography>
            <Typography>Created: {new Date(stats.created).toLocaleString()}</Typography>
            <Typography>Expiry: {new Date(stats.expiry).toLocaleString()}</Typography>
            <Typography>Clicks: {stats.clicks}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Click Details:</Typography>
            {stats.details.length === 0 ? <Typography>No clicks yet.</Typography> : (
              <ul>
                {stats.details.map((d: any, i: number) => (
                  <li key={i}>{new Date(d.timestamp).toLocaleString()} | Referrer: {d.referrer || 'N/A'} | IP: {d.ip}</li>
                ))}
              </ul>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default App;
