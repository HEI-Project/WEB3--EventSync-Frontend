import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ImageField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ImageInput,
  required,
  Show,
  SimpleShowLayout,
  useRecordContext,
  FilterLiveSearch,
} from 'react-admin';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import { SaveDeleteToolbar } from './components';

const SpeakerFilters = [<FilterLiveSearch source="fullName" key="q" />];

export const SpeakerList = () => (
  <List filters={SpeakerFilters}>
    <Datagrid rowClick="edit">
      <ImageField
        source="photoUrl"
        label="Photo"
        sx={{
          '& img': {
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover',
          },
        }}
      />
      <TextField source="fullName" label="Nom" />
      <TextField source="bio" label="Bio" />
      <NumberField source="sessions.length" label="Sessions" />
    </Datagrid>
  </List>
);

const SpeakerForm = () => (
  <SimpleForm toolbar={<SaveDeleteToolbar />}>
    <TextInput
      source="fullName"
      label="Nom complet"
      validate={required()}
      fullWidth
    />
    <TextInput source="photoUrl" label="URL de la photo" fullWidth />
    <ImageField source="photoUrl" label="Aperçu" />
    <TextInput
      source="bio"
      label="Biographie"
      multiline
      rows={4}
      fullWidth
    />
    <TextInput
      source="externalLinks"
      label="Liens externes (séparés par des virgules)"
      fullWidth
    />
  </SimpleForm>
);

export const SpeakerEdit = () => (
  <Edit>
    <SpeakerForm />
  </Edit>
);

export const SpeakerCreate = () => (
  <Create>
    <SpeakerForm />
  </Create>
);

const SpeakerTitle = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <>{record.fullName}</>;
};

export const SpeakerShow = () => (
  <Show title={<SpeakerTitle />}>
    <SimpleShowLayout>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                src=""
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  border: '2px solid rgba(148,163,184,0.12)',
                  bgcolor: 'rgba(148,163,184,0.12)',
                }}
              >
                <ImageField
                  source="photoUrl"
                  sx={{
                    width: 96,
                    height: 96,
                    '& img': {
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    },
                  }}
                />
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#e2e8f0',
                }}
              >
                <TextField source="fullName" />
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                Intervenant
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              background: '#0f1322',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2.5 }}>
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
                  Biographie
                </Typography>
                <TextField
                  source="bio"
                  sx={{ color: 'text.secondary' }}
                />
              </Box>
              <Box sx={{ mb: 2.5 }}>
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
                <NumberField source="sessions.length" />
              </Box>
              <Box>
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
                  Liens
                </Typography>
                <TextField
                  source="externalLinks"
                  sx={{ color: 'text.secondary' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </SimpleShowLayout>
  </Show>
);
