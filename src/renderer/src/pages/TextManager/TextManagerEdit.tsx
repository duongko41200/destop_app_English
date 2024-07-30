import { Box } from '@mui/material'
import { HEADERS } from '@renderer/consts/header'
import { typeName, typeText } from '@renderer/consts/text'
import { useEffect, useState } from 'react'
import { EditBase, SelectInput, TextInput, Title, useNotify, useRecordContext } from 'react-admin'
import { useNavigate } from 'react-router-dom'
import CustomForm from '../../components/CustomForm'
import { UPDATED_SUCCESS } from '../../consts/general'
import { boxStyles } from '../../styles'
import { BaseComponentProps, RecordValue } from '../../types/general'

const TextManagerEditForm = ({ resource, dataProvider }: BaseComponentProps) => {
  const resourcePath = `/${resource}`
  const notify = useNotify()
  const navigate = useNavigate()
  const record = useRecordContext()
  const [topics, setTopics] = useState([])
  const [date, setDate] = useState(new Date())
  const [statusType, setStatusType] = useState(typeName[record?.typeText])

  console.log({ record })

  const handleUpdate = async (values: RecordValue) => {
    console.log('value update là;', values)

    if (values.typeId == '2') {
      values.typeText = 'word'
      values.attributes = {
        spelling: '',
        audio: '',
        advan_translation: '',
        userId: localStorage.getItem('userId'),
        // _id: '65de0fb43e149b71cf778695',
        createdAt: values.attributes.createdAt,
        updatedAt: new Date().toISOString()
      }
      delete values.structure
      delete values.typeId
    } else {
      values.typeText = 'sentence'
      values.attributes = {
        structure: values.structure,
        userId: localStorage.getItem('userId'),
        // _id: '6601a49510afeea5f4b5fbde',
        createdAt: values.attributes.createdAt,
        updatedAt: new Date().toISOString()
      }
      delete values?.structure
      delete values.typeId
    }

    console.log('value new:', values)

    try {
      await dataProvider.update(resource, {
        id: record?._id,
        data: values,
        previousData: record
      })

      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
      navigate(resourcePath)
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }
  const onChangeStatusType = (e) => {
    setStatusType(e.target.value)
  }

  const getAllTopics = async () => {
    let topicLocalStorage = []
    const url = `http://localhost:3052/v1/api/topic/all`
    const request = new Request(`${url}`, {
      method: 'GET',
      headers: new Headers(HEADERS)
    })

    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    const resMetadata = data.metadata

    topicLocalStorage = resMetadata.map((topic) => {
      topic = {
        _id: topic._id,
        id: topic._id,
        name: topic.name,
        numberCount: 0,
        listElement: [],
        day: date.getDate(),
        isActive: false
      }

      return topic
    })

    localStorage.setItem('topics', JSON.stringify(topicLocalStorage))
    setTopics(topicLocalStorage)
  }

  const getTopic = async () => {
    const topicLocalStorage = JSON.parse(localStorage.getItem('topics') as any)
    if (topicLocalStorage != null) {
      let topicActive = topicLocalStorage.map((topic) => {
        topic['isActive'] = false

        return topic
      })
      setTopics(topicActive)
    } else {
      getAllTopics()
    }
  }

  useEffect(() => {
    getTopic()
  }, [])

  return (
    <Box sx={boxStyles}>
      <EditBase>
        <Title title="ユーザ登録　編集" />
        <CustomForm
          pathTo={resourcePath}
          // validate={validateTextManagerEdition}
          showDeleteButton={false}
          showSaveButton={true}
          showCancelButton={true}
          handleSave={handleUpdate}
        >
          <SelectInput
            source="typeId"
            choices={typeText}
            isRequired
            // defaultValue={1}
            label="Loại dạng nhập"
            onChange={onChangeStatusType}
          />

          <TextInput source="text" fullWidth isRequired label="Nhập text" resettable />

          {typeName[`sentence`] == statusType ? (
            <TextInput source="structure" fullWidth label="Nhập Công thức" resettable />
          ) : (
            <></>
          )}

          <TextInput source="defind" fullWidth isRequired label="Dịch nghĩa" resettable />

          <SelectInput
            source="topicId"
            choices={topics}
            isRequired
            // defaultValue={2}
            label="Topic"
            resettable
          />
        </CustomForm>
      </EditBase>
    </Box>
  )
}

const TextManagerEdit = (props: BaseComponentProps) => {
  return (
    <Box sx={boxStyles}>
      <EditBase>
        <TextManagerEditForm {...props} />
      </EditBase>
    </Box>
  )
}

export default TextManagerEdit
