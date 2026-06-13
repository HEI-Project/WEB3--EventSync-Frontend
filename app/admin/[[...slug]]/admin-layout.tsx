import { Layout, Menu, DashboardMenuItem } from 'react-admin';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MicIcon from '@mui/icons-material/Mic';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CustomMenu = () => (
  <Menu>
    <Box px={2.5} pt={2.5} pb={1}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: '0.625rem',
        }}
      >
        Navigation
      </Typography>
    </Box>
    <DashboardMenuItem />
    <Menu.Item
      to="/events"
      primaryText="Événements"
      leftIcon={<CalendarMonthIcon />}
    />
    <Menu.Item
      to="/sessions"
      primaryText="Sessions"
      leftIcon={<MicIcon />}
    />
    <Menu.Item
      to="/speakers"
      primaryText="Intervenants"
      leftIcon={<PeopleIcon />}
    />
    <Menu.Item
      to="/rooms"
      primaryText="Salles"
      leftIcon={<MeetingRoomIcon />}
    />
  </Menu>
);

export const MyLayout = (props: any) => (
  <Layout {...props} menu={CustomMenu} />
);
