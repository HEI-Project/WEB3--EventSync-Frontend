import { useEffect, useState } from 'react';
import { Title, useDataProvider } from 'react-admin';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MicIcon from '@mui/icons-material/Mic';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Stats {
  events: number;
  sessions: number;
  speakers: number;
  rooms: number;
  totalCapacity: number;
}

interface RecentEvent {
  id: string;
  title: string;
  location: string;
  startDate: string;
}

interface UpcomingSession {
  id: string;
  title: string;
  startTime: string;
  capacity: number;
}

const StatCard = ({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  subtitle?: string;
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
          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}
            >
              {subtitle}
            </Typography>
          )}
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

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card
    sx={{
      borderRadius: 3,
      border: '1px solid rgba(148,163,184,0.08)',
      background: '#0f1322',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid rgba(148,163,184,0.08)',
      }}
    >
      <Box sx={{ color: '#22d3ee', display: 'flex' }}>{icon}</Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: '#e2e8f0',
        }}
      >
        {title}
      </Typography>
    </Box>
    {children}
  </Card>
);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(d);
};

export const AdminDashboard = () => {
  const dataProvider = useDataProvider();
  const [stats, setStats] = useState<Stats>({
    events: 0,
    sessions: 0,
    speakers: 0,
    rooms: 0,
    totalCapacity: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    []
  );

  useEffect(() => {
    Promise.all([
      dataProvider.getList('events', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
      dataProvider.getList('sessions', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
      dataProvider.getList('speakers', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
      dataProvider.getList('rooms', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      }),
    ]).then(
      ([
        eventsRes,
        sessionsRes,
        speakersRes,
        roomsRes,
      ]) => {
        const events = eventsRes.data ?? [];
        const sessions = sessionsRes.data ?? [];
        const speakers = speakersRes.data ?? [];

        const totalCapacity = sessions.reduce(
          (sum: number, s: any) => sum + (Number(s.capacity) || 0),
          0
        );

        setStats({
          events: eventsRes.total ?? events.length,
          sessions: sessionsRes.total ?? sessions.length,
          speakers: speakersRes.total ?? speakers.length,
          rooms: roomsRes.total ?? (roomsRes.data ?? []).length,
          totalCapacity,
        });

        const sortedEvents = [...events]
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() -
              new Date(a.startDate).getTime()
          )
          .slice(0, 5);
        setRecentEvents(sortedEvents);

        const now = new Date();
        const upcoming = (sessions as any[])
          .filter((s) => new Date(s.startTime) > now)
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() -
              new Date(b.startTime).getTime()
          )
          .slice(0, 6);
        setUpcomingSessions(upcoming);
      }
    );
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
          Aperçu général de votre plateforme événementielle
        </Typography>
      </Box>

      <Grid container spacing={2.5} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<CalendarMonthIcon />}
            label="Événements"
            value={stats.events}
            color="#22d3ee"
            subtitle="Tous les événements"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<MicIcon />}
            label="Sessions"
            value={stats.sessions}
            color="#a78bfa"
            subtitle="Total programmé"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<PeopleIcon />}
            label="Intervenants"
            value={stats.speakers}
            color="#34d399"
            subtitle="Participants"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<MeetingRoomIcon />}
            label="Salles"
            value={stats.rooms}
            color="#fbbf24"
            subtitle="Espaces disponibles"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<GroupWorkIcon />}
            label="Capacité totale"
            value={stats.totalCapacity.toLocaleString('fr-FR')}
            color="#f472b6"
            subtitle="Places assises"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<TrendingUpIcon />}
            label="Moy. sessions/évt"
            value={
              stats.events > 0
                ? (stats.sessions / stats.events).toFixed(1)
                : '0'
            }
            color="#fb923c"
            subtitle="Ratio global"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Événements récents"
            icon={<CalendarMonthIcon />}
          >
            {recentEvents.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">
                  Aucun événement pour le moment
                </Typography>
              </Box>
            ) : (
              recentEvents.map((event, i) => (
                <Box key={event.id}>
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 120ms ease-out',
                      '&:hover': { background: 'rgba(34,211,238,0.04)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#22d3ee',
                          opacity: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: '#e2e8f0',
                            lineHeight: 1.3,
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {event.location} &middot;{' '}
                          {formatShortDate(event.startDate)}
                        </Typography>
                      </Box>
                    </Box>
                    <ChevronRightIcon
                      sx={{ fontSize: 16, color: 'text.disabled' }}
                    />
                  </Box>
                  {i < recentEvents.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(148,163,184,0.04)' }} />
                  )}
                </Box>
              ))
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Prochaines sessions"
            icon={<MicIcon />}
          >
            {upcomingSessions.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">
                  Aucune session à venir
                </Typography>
              </Box>
            ) : (
              upcomingSessions.map((session, i) => (
                <Box key={session.id}>
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 120ms ease-out',
                      '&:hover': { background: 'rgba(167,139,250,0.04)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#a78bfa',
                          opacity: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: '#e2e8f0',
                            lineHeight: 1.3,
                          }}
                        >
                          {session.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {formatDate(session.startTime)}
                          {session.capacity && (
                            <>
                              {' '}
                              &middot;{' '}
                              {session.capacity.toLocaleString('fr-FR')} places
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip
                        label={session.capacity > 0 ? 'Actif' : 'Complet'}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          background:
                            session.capacity > 0
                              ? 'rgba(52,211,153,0.12)'
                              : 'rgba(248,113,113,0.12)',
                          color:
                            session.capacity > 0 ? '#34d399' : '#f87171',
                          border: 'none',
                        }}
                      />
                    </Box>
                  </Box>
                  {i < upcomingSessions.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(148,163,184,0.04)' }} />
                  )}
                </Box>
              ))
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};
