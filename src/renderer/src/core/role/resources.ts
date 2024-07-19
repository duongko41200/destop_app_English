import { Group } from '@mui/icons-material/'

import { UserCreate, UserEdit, UserList, UserShow } from '../..//pages/Users'
import {
  TextManagerList,
  TextManagerCreate,
  TextManagerEdit,
  TextManagerShow
} from '../../pages/TextManager'
import type { ResourceIF } from '@/types/general'

const Resources: ResourceIF[] = [
  {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
    show: UserShow,
    icon: Group,
    resource: 'users',
    label: 'User'
  },
  {
    list: TextManagerList,
    edit: TextManagerEdit,
    create: TextManagerCreate,
    show: TextManagerShow,
    // icon: Group,
    resource: 'text',
    label: 'Text'
  }
]

export default Resources
