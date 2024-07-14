import { Datagrid, DeleteWithConfirmButton, EditButton, List, TextField } from 'react-admin'
import { BaseComponentProps } from '../../types/general'
import { CustomButtonByRoleDelete } from '@renderer/components/CustomButtonByRoleDelete'
import { CustomButtonByRoleEdit } from '@renderer/components/CustomButtonByRoleEdit'
import { ListToolBar } from '@renderer/components/ListToolBar'
import { validRole } from '../../core/role/permissions'

const UserList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  // const [userLogin, setUserLogin] = useState({});

  // const getUserLogin = async () => {
  //   try {
  //     const userId = getClientCookieValue(HEADER.CLIENT_ID);
  //     let getUser = await dataProvider.getOne(resource, { id: userId });
  //     setUserLogin({ id: getUser.data.id, role: getUser.data.role });
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  // useEffect(() => {
  //   getUserLogin();
  // }, []);

  return (
    <List
      title="管理ユーザー　一覧"
      actions={<ListToolBar isShowCreate={validRole('create', actions)} />}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField source="id" label="NO" />
        <TextField source="name" label="Tên Người Dùng" />
        <TextField source="email" label="Email" />
        <TextField source="roles" label="Role" />

        {validRole('delete', actions) && (
          <CustomButtonByRoleDelete
            source="role"
            label="Xóa"
            // userLogin={userLogin}
          >
            <DeleteWithConfirmButton
              confirmContent="よろしいですか?"
              confirmTitle="削除"
              label="Xóa"
              confirmColor="warning"
            ></DeleteWithConfirmButton>
          </CustomButtonByRoleDelete>
        )}

        {validRole('edit', actions) && (
          <CustomButtonByRoleEdit
            source="role"
            label="Chỉnh Sửa"
            // userLogin={userLogin}
          >
            <EditButton label="Edit"></EditButton>
          </CustomButtonByRoleEdit>
        )}
      </Datagrid>
    </List>
  )
}

export default UserList
