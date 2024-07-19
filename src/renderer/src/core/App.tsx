import { Admin, Resource } from 'react-admin'

import { Actions, Permission } from '@/types/roles'
import authProvider from '../providers/authProvider'
import dataProvider from '../providers/dataProviders/dataProvider'
import { checkRole } from './role/permissions'

// Define resources
import { ResourceIF } from '@/types/general'
import Resources from './role/resources'

// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} requireAuth>
    {(permission: Permission) => {
      return (
        <>
          {Resources.map((resource: ResourceIF) => {
            const actions: Actions = permission[resource.resource] as Actions

            if (!actions) {
              throw new Error(`Resource configuration not found for ${resource.resource}`)
            }

            const { list, edit, create, show, icon, defaultProp } = resource

            const props = defaultProp
              ? {}
              : {
                  resource: resource.resource,
                  dataProvider,
                  actions,
                  authProvider
                }
            return (
              <Resource
                key={resource.resource}
                name={resource.resource}
                list={checkRole({
                  actions,
                  action: 'list',
                  component: list,
                  props
                })}
                show={checkRole({
                  actions,
                  action: 'show',
                  component: show,
                  props
                })}
                edit={checkRole({
                  actions,
                  action: 'edit',
                  component: edit,
                  props
                })}
                create={checkRole({
                  actions,
                  action: 'create',
                  component: create,
                  props
                })}
                icon={icon}
                options={{ label: resource.label }}
              />
            )
          })}

          {/* <CustomRoutes>
            <Route
              path="/product-inspection/:id"
              element={<ProductInspectionEdit permission={permission} />}
            />
            <Route
              path="/registration-learning/:id"
              element={<RegistrationLearning />}
            />
          </CustomRoutes> */}
        </>
      )
    }}
  </Admin>
)

export default App
