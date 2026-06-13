import { Card, CardContent, CardHeader } from '@mui/material';
import { Title } from 'react-admin';

export const AdminDashboard = () => (
  <Card>
    <Title title="Tableau de bord" />
    <CardHeader title="Bienvenue dans l'administration EventSync" />
    <CardContent>
      <p style={{ color: '#94a3b8' }}>
        Utilisez le menu de gauche pour gérer les événements, sessions, intervenants et salles.
      </p>
    </CardContent>
  </Card>
);
