import { CustomButtonByRoleDelete } from '@renderer/components/CustomButtonByRoleDelete'
import { CustomButtonByRoleEdit } from '@renderer/components/CustomButtonByRoleEdit'
import { ListToolBar } from '@renderer/components/ListToolBar'
import { useEffect, useState } from 'react'
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  useRefresh
} from 'react-admin'
import { validRole } from '../../core/role/permissions'
import { BaseComponentProps } from '../../types/general'

const TextManagerList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  const [userLogin, setUserLogin] = useState({})
  const refresh = useRefresh()

  const getUserLogin = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const getUser = await dataProvider.getOne(resource, { id: userId })
      setUserLogin({ id: getUser.data.id, role: getUser.data.role })
      refresh()
    } catch (error) {
      console.log({ error })
    }
  }

  useEffect(() => {
    // getUserLogin()
    // refresh()
  }, [])

  return (
    <List
      title="管理ユーザー　一覧"
      actions={<ListToolBar isShowCreate={validRole('create', actions)} />}
    >
      <Datagrid rowClick="show">
        <TextField source="no" label="NO" />
        <TextField source="text" label="Câu/từ" />
        <TextField source="defind" label="Nghĩa" />
        <TextField source="repeat" label="Level" />
        <TextField source="dayReview" label="dayReview" />

        {validRole('delete', actions) && (
          <CustomButtonByRoleDelete source="role" label="Xóa" userLogin={userLogin}>
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
            label="Edit"
            // userLogin={userLogin}
          >
            <EditButton label="Edit"></EditButton>
          </CustomButtonByRoleEdit>
        )}
      </Datagrid>
    </List>
  )
}

export default TextManagerList
