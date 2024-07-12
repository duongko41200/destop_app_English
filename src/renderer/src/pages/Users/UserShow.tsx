import { TextInput, ShowBase, Title } from 'react-admin';
import CustomForm from '@/components/CustomForm';
import { BaseComponentProps } from '@/types/general';
import { Box } from '@mui/material';
import { boxStyles } from '../../styles';


const UserShow = ({ actions, resource }: BaseComponentProps) => {
  const resourcePath = `/${resource}`;

  return (
    <Box sx={boxStyles}>
      <ShowBase>
        <>
          <Title title="管理ユーザー管理　参照" />
          <CustomForm
            pathTo={resourcePath}
            showDeleteButton={false}
            showCancelButton={true}
          >
            {/* <TextInput
              source="userName"
              label="ユーザー名"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            />

            <CustomTextInput label="作成時" source="role" />
            <TextInput
              source="name"
              label="名前"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            />
            <FormatInputDateShow label="作成時" source="createAt" />
            <FormatInputDateShow label="更新日時" source="updateAt" />
            <TextInput
              source="updateBy"
              label="アップデーター"
              fullWidth
              disabled
              sx={disabledInputBackgroundStyle}
            /> */}
            <div>ksdjfksdjf</div>
          </CustomForm>
        </>
      </ShowBase>
    </Box>
  );
};

export default UserShow;
