import { Create, SelectInput, TextInput } from 'react-admin'

import { typeText } from '@renderer/consts/text'
import CustomForm from '../../components/CustomForm'
import { BaseComponentProps } from '../../types/general'
import { validateUserCreation } from './formValidator'

const TextManagerCreate = ({  resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`

  return (
    <Create redirect="list" title="管理ユーザー管理　新規作成">
      <CustomForm pathTo={resourcePath} validate={validateUserCreation} showDeleteButton={false}>
        {/* <div style={{ display: 'flex', alignItems: 'center', columnGap: 20 }}>
          <TextInput source="userName" isRequired label="ユーザー名(*)" />
        </div> */}

        <SelectInput
          source="typeText"
          choices={typeText}
          isRequired
          defaultValue={2}
          label="Loại dạng nhập(*)"
        />
        {/* <PasswordInput source="password" fullWidth isRequired label="パスワード(*)" /> */}
        <TextInput source="text" fullWidth isRequired label="Nhập text(*)" />

        <TextInput source="attributes" fullWidth isRequired label="Nhập Công thức(*)" />
        <TextInput source="defind" fullWidth isRequired label="Dịch nghĩa(*)" />

        <SelectInput
          source="typeText"
          choices={typeText}
          isRequired
          defaultValue={2}
          label="Loại dạng nhập(*)"
        />
      </CustomForm>
    </Create>
  )
}

export default TextManagerCreate
