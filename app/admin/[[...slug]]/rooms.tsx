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
} from 'react-admin';

export const RoomList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Nom" />
      <NumberField source="sessions.length" label="Sessions" />
    </Datagrid>
  </List>
);

const RoomForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom de la salle" validate={required()} fullWidth />
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
