'use client';

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Admin, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from '@/lib/api/data-provider';
import { authProvider } from '@/lib/api/auth-provider';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';
import { EventList, EventEdit, EventCreate } from './events';
import { SessionList, SessionEdit, SessionCreate } from './sessions';
import { SpeakerList, SpeakerEdit, SpeakerCreate } from './speakers';
import { RoomList, RoomEdit, RoomCreate } from './rooms';
import { AdminDashboard } from './dashboard';
import { MyLayout } from './admin-layout';
import { adminTheme } from './theme';

const i18nProvider = polyglotI18nProvider(() => frenchMessages, 'fr');

export default function AdminPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <BrowserRouter basename="/admin">
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        layout={MyLayout}
        dashboard={AdminDashboard}
        theme={adminTheme}
      >
        <Resource
          name="events"
          list={EventList}
          edit={EventEdit}
          create={EventCreate}
          show={ShowGuesser}
          options={{ label: 'Événements' }}
        />
        <Resource
          name="sessions"
          list={SessionList}
          edit={SessionEdit}
          create={SessionCreate}
          show={ShowGuesser}
          options={{ label: 'Sessions' }}
        />
        <Resource
          name="speakers"
          list={SpeakerList}
          edit={SpeakerEdit}
          create={SpeakerCreate}
          show={ShowGuesser}
          options={{ label: 'Intervenants' }}
        />
        <Resource
          name="rooms"
          list={RoomList}
          edit={RoomEdit}
          create={RoomCreate}
          show={ShowGuesser}
          options={{ label: 'Salles' }}
        />
      </Admin>
    </BrowserRouter>
  );
}
