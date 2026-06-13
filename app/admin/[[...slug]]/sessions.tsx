import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateTimeInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required,
  FilterLiveSearch,
} from 'react-admin';
import Box from '@mui/material/Box';
import { SaveDeleteToolbar } from './components';

const SessionFilters = [
  <FilterLiveSearch source="title" key="q" />,
  <ReferenceInput source="eventId" reference="events" label="Événement" key="eventId">
    <SelectInput optionText="title" />
  </ReferenceInput>,
  <ReferenceInput source="roomId" reference="rooms" label="Salle" key="roomId">
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

export const SessionList = () => (
  <List
    filters={SessionFilters}
    sort={{ field: 'startTime', order: 'ASC' }}
  >
    <Datagrid rowClick="edit">
      <TextField source="title" label="Titre" />
      <ReferenceField source="eventId" reference="events" label="Événement">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="roomId" reference="rooms" label="Salle">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startTime" label="Début" showTime />
      <DateField source="endTime" label="Fin" showTime />
      <NumberField
        source="capacity"
        label="Capacité"
        sx={{ fontWeight: 600 }}
      />
    </Datagrid>
  </List>
);

const SessionForm = () => (
  <SimpleForm toolbar={<SaveDeleteToolbar />}>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput
      source="description"
      label="Description"
      multiline
      rows={4}
      fullWidth
    />
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      <DateTimeInput
        source="startTime"
        label="Heure de début"
        validate={required()}
        sx={{ flex: 1 }}
      />
      <DateTimeInput
        source="endTime"
        label="Heure de fin"
        validate={required()}
        sx={{ flex: 1 }}
      />
    </Box>
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      <NumberInput
        source="capacity"
        label="Capacité"
        validate={required()}
        min={1}
        sx={{ flex: 1 }}
      />
      <ReferenceInput
        source="eventId"
        reference="events"
        label="Événement"
        sx={{ flex: 1 }}
      >
        <SelectInput optionText="title" />
      </ReferenceInput>
    </Box>
    <ReferenceInput source="roomId" reference="rooms" label="Salle">
      <SelectInput optionText="name" />
    </ReferenceInput>
  </SimpleForm>
);

export const SessionEdit = () => (
  <Edit>
    <SessionForm />
  </Edit>
);

export const SessionCreate = () => (
  <Create>
    <SessionForm />
  </Create>
);
