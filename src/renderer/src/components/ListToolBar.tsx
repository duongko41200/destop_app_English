import { CreateButton, TopToolbar } from 'react-admin';

export const ListToolBar = ({ isShowCreate }: { isShowCreate: boolean }) => (
  <TopToolbar>
    {isShowCreate && (
      <CreateButton
        label="新規登録"
      />
    )}
  </TopToolbar>
);
