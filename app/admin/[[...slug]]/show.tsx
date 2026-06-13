import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  ArrayField,
  Datagrid,
  ChipField,
  useRecordContext,
} from 'react-admin';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const FieldGroup = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontSize: '0.625rem',
        mb: 0.5,
        display: 'block',
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

const EventTitle = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <>{record.title}</>;
};

export const EventShow = () => (
  <Show title={<EventTitle />}>
    <SimpleShowLayout>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <FieldGroup label="Titre">
                <TextField
                  source="title"
                  sx={{ fontSize: '1.125rem', fontWeight: 600 }}
                />
              </FieldGroup>
              <FieldGroup label="Description">
                <TextField
                  source="description"
                  sx={{ color: 'text.secondary' }}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <FieldGroup label="Lieu">
                <TextField source="location" />
              </FieldGroup>
              <FieldGroup label="Date de début">
                <DateField source="startDate" showTime />
              </FieldGroup>
              <FieldGroup label="Date de fin">
                <DateField source="endDate" showTime />
              </FieldGroup>
              <FieldGroup label="Sessions">
                <NumberField source="sessions.length" />
              </FieldGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);

const SessionTitle = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <>{record.title}</>;
};

export const SessionShow = () => (
  <Show title={<SessionTitle />}>
    <SimpleShowLayout>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <FieldGroup label="Titre">
                <TextField
                  source="title"
                  sx={{ fontSize: '1.125rem', fontWeight: 600 }}
                />
              </FieldGroup>
              <FieldGroup label="Description">
                <TextField
                  source="description"
                  sx={{ color: 'text.secondary' }}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <FieldGroup label="Événement">
                <ReferenceField
                  source="eventId"
                  reference="events"
                  link="show"
                >
                  <TextField source="title" />
                </ReferenceField>
              </FieldGroup>
              <FieldGroup label="Salle">
                <ReferenceField
                  source="roomId"
                  reference="rooms"
                  link="show"
                >
                  <TextField source="name" />
                </ReferenceField>
              </FieldGroup>
              <FieldGroup label="Début">
                <DateField source="startTime" showTime />
              </FieldGroup>
              <FieldGroup label="Fin">
                <DateField source="endTime" showTime />
              </FieldGroup>
              <FieldGroup label="Capacité">
                <NumberField source="capacity" />
              </FieldGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
