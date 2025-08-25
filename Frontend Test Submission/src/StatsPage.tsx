import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Divider, Box, List, ListItem, ListItemText, Alert } from '@mui/material';

// This should match your backend API
const API_BASE = 'http://localhost:3000';

interface ClickDetail {
  timestamp: string;
  referrer: string;
  ip: string;
  geo?: string; // Placeholder for geo info
}

interface ShortUrlStats {
  shortcode: string;
  url: string;
  created: string;
  expiry: string;
  clicks: number;
  details: ClickDetail[];
}

const StatsPage: React.FC = () => {
  const [statsList, setStatsList] = useState<ShortUrlStats[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // For demo: get all shortcodes from sessionStorage (since backend is in-memory)
    const codes = JSON.parse(sessionStorage.getItem('shortcodes') || '[]');
    if (!codes.length) return;
    Promise.all(
      codes.map((code: string) =>
        fetch(`${API_BASE}/shorturls/${code}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => data ? { ...data, shortcode: code } : null)
      )
    ).then(results => {
      setStatsList(results.filter(Boolean));
    }).catch(() => setError('Failed to fetch stats.'));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>All Shortened URLs (Session)</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {statsList.length === 0 ? (
          <Typography>No URLs found in this session.</Typography>
        ) : (
          <List>
            {statsList.map((stat) => (
              <Box key={stat.shortcode} sx={{ mb: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6">Short Link: <a href={`http://localhost:3000/${stat.shortcode}`} target="_blank" rel="noopener noreferrer">http://localhost:3000/{stat.shortcode}</a></Typography>
                <Typography>Original URL: {stat.url}</Typography>
                <Typography>Created: {new Date(stat.created).toLocaleString()}</Typography>
                <Typography>Expiry: {new Date(stat.expiry).toLocaleString()}</Typography>
                <Typography>Clicks: {stat.clicks}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>Click Details:</Typography>
                {stat.details.length === 0 ? <Typography>No clicks yet.</Typography> : (
                  <List>
                    {stat.details.map((d, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={`Time: ${new Date(d.timestamp).toLocaleString()} | Referrer: ${d.referrer || 'N/A'} | IP: ${d.ip}`}
                          secondary={d.geo ? `Geo: ${d.geo}` : ''}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default StatsPage;
