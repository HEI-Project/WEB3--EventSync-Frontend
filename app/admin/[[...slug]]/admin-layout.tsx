import { Layout, Menu, DashboardMenuItem } from 'react-admin';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MicIcon from '@mui/icons-material/Mic';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const CustomMenu = () => (
  <Menu>
    <DashboardMenuItem to="/admin" />
    <Menu.Item to="/admin/events" primaryText="Événements" leftIcon={<CalendarMonthIcon />} />
    <Menu.Item to="/admin/sessions" primaryText="Sessions" leftIcon={<MicIcon />} />
    <Menu.Item to="/admin/speakers" primaryText="Intervenants" leftIcon={<PeopleIcon />} />
    <Menu.Item to="/admin/rooms" primaryText="Salles" leftIcon={<MeetingRoomIcon />} />
  </Menu>
);

export const MyLayout = (props: any) => (
  <Layout {...props} menu={CustomMenu} />
);
