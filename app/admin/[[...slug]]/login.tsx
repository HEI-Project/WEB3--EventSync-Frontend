import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
    } catch {
      notify('Email ou mot de passe incorrect', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080c18',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-25%',
          right: '-10%',
          width: '40%',
          height: '60%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-5%',
          width: '35%',
          height: '50%',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Card
        sx={{
          width: 400,
          maxWidth: '90%',
          background: '#0f1322',
          border: '1px solid rgba(148,163,184,0.08)',
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(34,211,238,0.12)',
                color: '#22d3ee',
              }}
            >
              <EventIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: '#e2e8f0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                EventSync
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}
              >
                Administration
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: '#e2e8f0',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Connectez-vous
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              variant="filled"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  background: 'rgba(148,163,184,0.06)',
                  '&:hover': { background: 'rgba(148,163,184,0.1)' },
                  '&.Mui-focused': {
                    background: 'rgba(148,163,184,0.08)',
                    boxShadow: '0 0 0 2px rgba(34,211,238,0.2)',
                  },
                },
              }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="filled"
              size="small"
              sx={{ mb: 3 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  background: 'rgba(148,163,184,0.06)',
                  '&:hover': { background: 'rgba(148,163,184,0.1)' },
                  '&.Mui-focused': {
                    background: 'rgba(148,163,184,0.08)',
                    boxShadow: '0 0 0 2px rgba(34,211,238,0.2)',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.25,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.8125rem',
                background: '#22d3ee',
                color: '#080c18',
                '&:hover': {
                  background: '#67e8f9',
                  boxShadow: '0 4px 12px rgba(34,211,238,0.3)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                transition:
                  'all 150ms cubic-bezier(0.23,1,0.32,1)',
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
