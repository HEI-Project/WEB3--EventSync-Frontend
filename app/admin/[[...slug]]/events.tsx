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
} from 'react-admin';
import { SaveDeleteToolbar } from './components';

export const EventList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
      <NumberField source="sessions.length" label="Sessions" />
    </Datagrid>
  </List>
);

const EventForm = () => (
  <SimpleForm toolbar={<SaveDeleteToolbar />}>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={4} fullWidth />
    <TextInput source="location" label="Lieu" fullWidth />
    <DateTimeInput source="startDate" label="Date de début" validate={required()} />
    <DateTimeInput source="endDate" label="Date de fin" validate={required()} />
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
