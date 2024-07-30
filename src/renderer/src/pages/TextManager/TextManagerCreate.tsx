import { Create, SelectInput, TextInput, useNotify, useRefresh, useResetStore } from 'react-admin'

import { UPDATED_SUCCESS } from '@renderer/consts/general'
import { HEADERS } from '@renderer/consts/header'
import { typeName, typeText } from '@renderer/consts/text'
import dataProvider from '@renderer/providers/dataProviders/dataProvider'
import { useEffect, useState } from 'react'
import { FieldValues,useForm } from 'react-hook-form'
import CustomForm from '../../components/CustomForm'
import { BaseComponentProps } from '../../types/general'

const TextManagerCreate = ({ resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`
  const [topics, setTopics] = useState([])
  const [date, setDate] = useState(new Date())
  const [statusType, setStatusType] = useState(2)
  const notify = useNotify()

  const [test, setTest] = useState('')
  const { handleSubmit, reset } = useForm();




  //logic

  const onChangeStatusType = (e) => {
    setStatusType(e.target.value)
  }

  const handleSave = async (values: FieldValues) => {
    console.log(':value form;', values)

    if (values.typeText == typeName['sentence']) {
      values.typeText = 'sentence'
      values.attributes = {
        structure: values.attributes,
        userId: localStorage.getItem('userId'),
        // _id: '6601a49510afeea5f4b5fbde',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    if (values.typeText == typeName['word']) {
      values.typeText = 'word'
      values.attributes = {
        spelling: '',
        audio: '',
        advan_translation: '',
        userId: localStorage.getItem('userId'),
        // _id: '65de0fb43e149b71cf778695',
        createdAt: '2024-02-27T16:37:08.393Z'
      }
    }
    console.log(':value new;', values)

    try {
      const create = await dataProvider.create('text', { data: values })

      console.log({ create })
      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
      setTest('duong')
    } catch (error) {
      notify('Cảnh báo: ' + error, {
        type: 'warning'
      })
    }
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
    <Create title="管理ユーザー管理　新規作成">
      <CustomForm
        pathTo={resourcePath}
        // validate={validateUserCreation}
        showDeleteButton={false}
        handleSave={handleSave}
      >
        <SelectInput
          source="typeText"
          choices={typeText}
          isRequired
          defaultValue={2}
          label="Loại dạng nhập"
          onChange={onChangeStatusType}
        />
        <TextInput source="text" fullWidth isRequired label="Nhập text" resettable value={test} />

        {typeName[`sentence`] == statusType ? (
          <TextInput source="attributes" fullWidth label="Nhập Công thức" resettable />
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
    </Create>
  )
}

export default TextManagerCreate
