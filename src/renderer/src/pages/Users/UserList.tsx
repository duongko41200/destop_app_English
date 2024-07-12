import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteWithConfirmButton,
  FunctionField,
} from 'react-admin';
// import { ListToolBar } from '@repo/ui/src/components/ListToolBar';
import { BaseComponentProps } from '../../types/general';

// import { CustomButtonByRoleDelete } from '@repo/ui/src/components/CustomButtonByRoleDelete';
import { validRole } from '../../core/role/permissions';
import { useEffect, useState } from 'react';
// import { CustomButtonByRoleEdit } from '../../components/CustomButtonByRoleEdit';
import { getClientCookieValue } from '../../utils/cookies';
import { HEADER } from '../../consts/access';
import { Role } from '../../types/user';

const UserList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  const [userLogin, setUserLogin] = useState({});

  const getUserLogin = async () => {
    try {
      const userId = getClientCookieValue(HEADER.CLIENT_ID);
      let getUser = await dataProvider.getOne(resource, { id: userId });
      setUserLogin({ id: getUser.data.id, role: getUser.data.role });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getUserLogin();
  }, []);

  return (
    <List
      title="管理ユーザー　一覧"
      // actions={<ListToolBar isShowCreate={validRole('create', actions)} />}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        {/* <TextField source="id" label="NO" />
        <TextField source="userName" label="ユーザー名" /> */}
        <FunctionField
          label="権限"
          render={({ role }: { role: Role }) => {
            return "duong";
          }}
        />
        {/* <TextField source="name" label="名前" /> */}
        {/* <EditButton label="編集"></EditButton>
        <DeleteWithConfirmButton label="削除"></DeleteWithConfirmButton> */}

        {/* {validRole('delete', actions) && (
          <CustomButtonByRoleDelete
            source="role"
            label="削除"
            userLogin={userLogin}
          >
            <DeleteWithConfirmButton
              confirmContent="よろしいですか?"
              confirmTitle="削除"
              label="削除"
              confirmColor="warning"
            ></DeleteWithConfirmButton>
          </CustomButtonByRoleDelete>
        )}

        {validRole('edit', actions) && (
          <CustomButtonByRoleEdit
            source="role"
            label="削除"
            userLogin={userLogin}
          >
            <EditButton label="編集"></EditButton>
          </CustomButtonByRoleEdit>
        )} */}
      </Datagrid>
    </List>
  );
};

export default UserList;
