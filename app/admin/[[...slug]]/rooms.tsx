import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  required,
  Show,
  SimpleShowLayout,
  useRecordContext,
} from 'react-admin';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SaveDeleteToolbar, BulkActionButtons } from './components';

export const RoomList = () => (
  <List>
    <Datagrid rowClick="edit" bulkActionButtons={<BulkActionButtons />}>
      <TextField source="name" label="Nom" />
      <NumberField source="sessions.length" label="Sessions" />
    </Datagrid>
  </List>
);

const RoomForm = () => (
  <SimpleForm toolbar={<SaveDeleteToolbar />}>
    <TextInput
      source="name"
      label="Nom de la salle"
      validate={required()}
      fullWidth
    />
  </SimpleForm>
);

export const RoomEdit = () => (
  <Edit>
    <RoomForm />
  </Edit>
);

export const RoomCreate = () => (
  <Create>
    <RoomForm />
  </Create>
);

const RoomTitle = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <>{record.name}</>;
};

export const RoomShow = () => (
  <Show title={<RoomTitle />}>
    <SimpleShowLayout>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
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
                Nom de la salle
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: '#e2e8f0',
                }}
              >
                <TextField source="name" />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
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
                Sessions
              </Typography>
              <NumberField
                source="sessions.length"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: '#22d3ee',
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
