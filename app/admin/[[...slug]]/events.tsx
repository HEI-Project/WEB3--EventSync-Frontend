import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateTimeInput,
  required,
  SearchInput,
  FilterLiveSearch,
  ChipField,
} from 'react-admin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SaveDeleteToolbar } from './components';

const EventFilters = [
  <FilterLiveSearch source="title" key="q" />,
];

export const EventList = () => (
  <List
    filters={EventFilters}
    sort={{ field: 'startDate', order: 'DESC' }}
  >
    <Datagrid
      rowClick="edit"
      sx={{
        '& .RaDatagrid-dataRow td:first-of-type': {
          fontWeight: 500,
        },
      }}
    >
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
      <NumberField
        source="sessions.length"
        label="Sessions"
        sx={{ color: '#22d3ee', fontWeight: 600 }}
      />
    </Datagrid>
  </List>
);

const EventForm = () => (
  <SimpleForm toolbar={<SaveDeleteToolbar />}>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput
      source="description"
      label="Description"
      multiline
      rows={4}
      fullWidth
    />
    <TextInput source="location" label="Lieu" fullWidth />
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      <DateTimeInput
        source="startDate"
        label="Date de début"
        validate={required()}
        sx={{ flex: 1 }}
      />
      <DateTimeInput
        source="endDate"
        label="Date de fin"
        validate={required()}
        sx={{ flex: 1 }}
      />
    </Box>
  </SimpleForm>
);

export const EventEdit = () => (
  <Edit>
    <EventForm />
  </Edit>
);

export const EventCreate = () => (
  <Create>
    <EventForm />
  </Create>
);
