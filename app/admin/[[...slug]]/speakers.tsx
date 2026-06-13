import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ImageField,
  required,
} from 'react-admin';

export const SpeakerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="fullName" label="Nom" />
      <TextField source="bio" label="Bio" />
      <NumberField source="sessions.length" label="Sessions" />
    </Datagrid>
  </List>
);

const SpeakerForm = () => (
  <SimpleForm>
    <TextInput source="fullName" label="Nom complet" validate={required()} fullWidth />
    <TextInput source="photoUrl" label="URL de la photo" fullWidth />
    <ImageField source="photoUrl" label="Aperçu" />
    <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
    <TextInput source="externalLinks" label="Liens externes (séparés par des virgules)" fullWidth />
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
