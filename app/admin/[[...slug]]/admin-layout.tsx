import { Layout } from 'react-admin';
import { UserMenu, Logout } from 'react-admin';

const MyUserMenu = () => (
  <UserMenu>
    <Logout />
  </UserMenu>
);

export const MyLayout = (props: any) => (
  <Layout {...props} userMenu={<MyUserMenu />} />
);
