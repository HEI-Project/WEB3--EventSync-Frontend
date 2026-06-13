import { useEffect, useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import EventIcon from '@mui/icons-material/Event';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  useEffect(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login({ email, password });
    } catch {
      notify('Email ou mot de passe incorrect', { type: 'error' });
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080c18',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 25% 50%, rgba(34,211,238,0.04) 0%, transparent 55%), radial-gradient(ellipse at 75% 50%, rgba(167,139,250,0.03) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <Card
        sx={{
          width: 368,
          maxWidth: '92vw',
          background: '#0f1322',
          border: '1px solid rgba(148,163,184,0.08)',
          borderRadius: 3,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(34,211,238,0.12)',
                color: '#22d3ee',
                mb: 1.5,
              }}
            >
              <EventIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#e2e8f0',
                letterSpacing: '-0.02em',
                mb: 0.25,
              }}
            >
              EventSync
            </Typography>
            <Typography
              sx={{ color: '#8896b0', fontSize: '0.75rem' }}
            >
              Administration
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              variant="outlined"
              size="small"
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !email || !password}
              sx={{
                py: 1.25,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                textTransform: 'none',
                background: '#22d3ee',
                color: '#080c18',
                '&:hover': {
                  background: '#67e8f9',
                },
                '&:active': { transform: 'scale(0.98)' },
                transition: 'all 150ms cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: '#080c18' }} />
              ) : (
                'Se connecter'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Notification />
    </Box>
  );
};
