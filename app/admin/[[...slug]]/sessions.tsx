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
} from 'react-admin';
import { SaveDeleteToolbar } from './components';

export const SessionList = () => (
  <List>
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
      <NumberField source="capacity" label="Capacité" />
    </Datagrid>
  </List>
);

const SessionForm = () => (
  <SimpleForm toolbar={<SaveDeleteToolbar />}>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={4} fullWidth />
    <DateTimeInput source="startTime" label="Heure de début" validate={required()} />
    <DateTimeInput source="endTime" label="Heure de fin" validate={required()} />
    <NumberInput source="capacity" label="Capacité" validate={required()} min={1} />
    <ReferenceInput source="eventId" reference="events" label="Événement">
      <SelectInput optionText="title" />
    </ReferenceInput>
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
