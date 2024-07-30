import { Button } from '@mui/material'
import { UPDATED_SUCCESS } from '@renderer/consts/general'
import dataProvider from '@renderer/providers/dataProviders/dataProvider'
import { CreateButton, TopToolbar, useNotify } from 'react-admin'

export const ListToolBar = ({
  isShowCreate,
  resource
}: {
  isShowCreate: boolean
  resource?: any
}) => {
  const notify = useNotify()

  console.log('resource', resource)

  const handleReset = async () => {
    try {
      const data = await dataProvider.resetData('text', {})

      console.log('data res', data)
      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }

  const handleSynch = async () => {


    try {
      const data = await dataProvider.synchData('text')

      console.log('data res', data)
      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }
  return (
    <TopToolbar>
      {resource && resource == 'text' && (
        <>
          <Button
            variant="text"
            sx={{
              '&.MuiButton-root': {
                lineHeight: 'inherit !important',
                padding: '4px 5px !important'
              }
            }}
            onClick={handleSynch}
          >
            Đồng bộ
          </Button>
          <Button
            variant="text"
            sx={{
              '&.MuiButton-root': {
                lineHeight: 'inherit !important',
                padding: '4px 5px !important'
              }
            }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </>
      )}

      {isShowCreate && <CreateButton label="新規登録" />}
    </TopToolbar>
  )
}
