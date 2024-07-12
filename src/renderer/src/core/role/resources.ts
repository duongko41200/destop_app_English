import { Group } from '@mui/icons-material/'

import { UserCreate, UserEdit, UserList, UserShow } from '../..//pages/Users'
import type { ResourceIF } from '@/types/general'

const Resources: ResourceIF[] = [
  {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
    show: UserShow,
    icon: Group,
    resource: 'users',
    label: '管理ユーザ'
  }
]

export default Resources
