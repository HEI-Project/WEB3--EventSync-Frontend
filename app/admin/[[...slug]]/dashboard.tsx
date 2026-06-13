import { useEffect, useState } from 'react';
import { Title, useDataProvider, useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MicIcon from '@mui/icons-material/Mic';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

interface Stats {
  events: number;
  sessions: number;
  speakers: number;
  rooms: number;
}

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <Card
    sx={{
      borderRadius: 3,
      border: '1px solid rgba(148,163,184,0.08)',
      background: '#0f1322',
      transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      },
    }}
  >
    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontSize: '0.6875rem',
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: '1.75rem',
              letterSpacing: '-0.02em',
              color: '#e2e8f0',
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}12`,
            color: color,
            '& .MuiSvgIcon-root': { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ events: 0, sessions: 0, speakers: 0, rooms: 0 });
  const dataProvider = useDataProvider();

  useEffect(() => {
    Promise.all([
      dataProvider.getList('events', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
      dataProvider.getList('sessions', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
      dataProvider.getList('speakers', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
      dataProvider.getList('rooms', { pagination: { page: 1, perPage: 1 }, sort: { field: 'id', order: 'ASC' }, filter: {} }),
    ]).then(([events, sessions, speakers, rooms]) => {
      setStats({
        events: events.total ?? events.data.length,
        sessions: sessions.total ?? sessions.data.length,
        speakers: speakers.total ?? speakers.data.length,
        rooms: rooms.total ?? rooms.data.length,
      });
    });
  }, [dataProvider]);

  return (
    <Box>
      <Title title="Tableau de bord" />
      <Box mb={4}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            color: '#e2e8f0',
            mb: 0.5,
          }}
        >
          Tableau de bord
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Aperçu de votre événementiel
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CalendarMonthIcon />}
            label="Événements"
            value={stats.events}
            color="#22d3ee"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<MicIcon />}
            label="Sessions"
            value={stats.sessions}
            color="#a78bfa"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<PeopleIcon />}
            label="Intervenants"
            value={stats.speakers}
            color="#34d399"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<MeetingRoomIcon />}
            label="Salles"
            value={stats.rooms}
            color="#fbbf24"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
