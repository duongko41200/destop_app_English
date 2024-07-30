import { Button } from '@mui/material'
import { CustomButtonByRoleDelete } from '@renderer/components/CustomButtonByRoleDelete'
import { CustomButtonByRoleEdit } from '@renderer/components/CustomButtonByRoleEdit'
import { ListToolBar } from '@renderer/components/ListToolBar'
import { UPDATED_SUCCESS } from '@renderer/consts/general'
import { useEffect, useState } from 'react'
import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  useNotify,
  useRefresh
} from 'react-admin'
import { validRole } from '../../core/role/permissions'
import { BaseComponentProps } from '../../types/general'

const TextManagerList = ({ actions, resource, dataProvider }: BaseComponentProps) => {
  const [userLogin, setUserLogin] = useState({})
  const refresh = useRefresh()
  const notify = useNotify()

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
    
  // const handleReset = async () => {
  //   try {
  //     const data = await dataProvider.resetData('text')

  //     console.log('data res', data)
  //     await notify(UPDATED_SUCCESS, {
  //       type: 'success'
  //     })
  //   } catch (error) {
  //     notify('エラー: 生産管理の更新に失敗しました: ' + error, {
  //       type: 'warning'
  //     })
  //   }
  // }

  useEffect(() => {
    // getUserLogin()
    // refresh()
  }, [])

  return (
    <List
      title="管理ユーザー　一覧"
      actions={<ListToolBar resource={resource} isShowCreate={validRole('create', actions)} />}
    >
{/* 
<Button
        variant="text"
        sx={{
          '& .MuiButton-root': {
            lineHeight: '0 !important',
            padding: '4px 5px !important'
          }
        }}
        onClick={handleReset}
      >
        Reset
      </Button> */}
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
