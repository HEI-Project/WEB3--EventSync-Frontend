import { SaveButton, DeleteButton, Toolbar, BulkDeleteButton } from 'react-admin';

export const SaveDeleteToolbar = (props: any) => (
  <Toolbar {...props} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <SaveButton />
    <DeleteButton />
  </Toolbar>
);

export const BulkActionButtons = () => (
  <>
    <BulkDeleteButton />
  </>
);
