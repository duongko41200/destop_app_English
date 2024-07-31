import type {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  PaginationPayload,
  SortPayload,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult
} from 'react-admin'
import { fetchUtils } from 'react-admin'
// import removeEmptyProperties from '@repo/utils/removeEmptyProperties';
// import { exclude } from '@repo/utils/excludeKey';
import { GetPutPresignedUrlparams, PutObjectViaPresignedUrlParams } from '@/types/dataProvider'
import { HEADERS } from '@renderer/consts/header'
import { validUrlApi } from '@renderer/consts/text'
import { pushId } from '@renderer/utils/pushId'

const apiUrlApp = `https://bot-app-english-apiss.vercel.app/v1/api`
const apiUrlDesktopApp = `http://localhost:3333/v1/api`
const httpClient = fetchUtils.fetchJson

const baseDataProvider: DataProvider = {
  // get a list of records based on sort, filter, and pagination
  getList: async (resource: string, params: GetListParams): Promise<GetListResult> => {
    console.log({ params })
    const { page, perPage } = params.pagination as PaginationPayload
    const { field, order } = params.sort as SortPayload
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter)
    }

    const requestParams = `sort=${query.sort}&&range=${query.range}&&filter=${query.filter}`

    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}?${requestParams}`

    const request = new Request(`${url}`, {
      method: 'GET',
      headers: new Headers(HEADERS)
    })
    const response = await fetch(request)

    console.log('response.ok', response.ok)
    if (response.ok === false) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    const resData = pushId(data.metadata)

    return {
      data: resData.slice((page - 1) * perPage, page * perPage),
      total: parseInt(data.metadata?.length, 10)
    }
  },
  // get a single record by id
  getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
    console.log('param;', params)
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/get-id/${params.id}`

    console.log({ url })

    const request = new Request(`${url}`, {
      method: 'GET',
      headers: new Headers(HEADERS)
    })

    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    console.log({ data })
    data.metadata.id = data.metadata._id
    const resData = data.metadata

    return {
      data: resData
    }
  },
  // get a list of records based on an array of ids
  getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}?id=${params.ids}`
    const {
      json: { metadata }
    } = await httpClient(url)

    return {
      data: metadata
    }
  },
  // get the records referenced to another record, e.g. comments for a post
  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult> => {
    const query = JSON.stringify(params)

    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/refer?${query}`
    const {
      json: { metadata }
    } = await httpClient(url)

    return metadata
  },
  // create a record
  create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}`

    let body = JSON.stringify(params.data)

    const request = new Request(`${url}`, {
      method: 'POST',
      headers: new Headers(HEADERS),
      body
    })

    const response = await fetch(request)

    console.log('response :', response)
    if (!response.ok) {
      console.log('Error')
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    console.log({ data })

    console.log(':::metadata', data.metadata)
    return {
      data: data.metadata
    }
  },

  createMany: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/batch`

    const body = JSON.stringify(params.data)

    const response = await httpClient(url, {
      method: 'POST',
      body
    })
    const {
      json: { metadata }
    } = response

    return {
      data: metadata
    }
  },

  // update a record based on a patch
  update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/${params.id}`

    console.log({ params })

    // let body
    // if (params.data instanceof FormData) {
    //   body = params.data
    // } else {
    //   body = JSON.stringify('tesst')
    // }
    let body = JSON.stringify(params.data)

    const response = await httpClient(url, {
      method: 'PUT',
      body
    })
    const {
      json: { metadata }
    } = response

    return {
      data: metadata
    }
  },

  getAll: async (resource: string) => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/batch`
    const {
      json: { metadata }
    } = await httpClient(url)

    return {
      data: metadata
    }
  },

  // update a list of records based on an array of ids and a common patch
  updateMany: async (resource: string, params: UpdateManyParams): Promise<UpdateManyResult> => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/batch`
    const body = JSON.stringify(params.data)

    const response = await httpClient(url, {
      method: 'PUT',
      body
    })
    const {
      json: { metadata }
    } = response

    return {
      data: metadata
    }
  },
  // delete a record by id
  delete: async (resource: string, params: DeleteParams): Promise<DeleteResult> => {
    console.log('params', params)
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/${params.id}`
    const response = await httpClient(url, {
      method: 'DELETE'
    })
    const {
      json: { metadata }
    } = response

    return {
      data: metadata
    }
  },
  // delete a list of records based on an array of ids
  deleteMany: async (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> => {
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/batch`
    const body = JSON.stringify(params.ids)

    console.log({ body })

    const response = await httpClient(url, {
      method: 'DELETE',
      body
    })

    const {
      json: { metadata }
    } = response
    console.log('deleteMany')

    return {
      data: metadata
    }
  },

  getPutPresignedUrl: async (resource: string, params: GetPutPresignedUrlparams) => {
    console.log({ resource, params })
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}`
    const body = JSON.stringify(params.data)

    const response = await httpClient(url, {
      method: 'POST',
      body
    })

    const {
      json: { presignedUrl }
    } = response

    return {
      data: { presignedUrl }
    }
  },

  putObjectViaPresignedUrl: async (resource: string, params: PutObjectViaPresignedUrlParams) => {
    const url = `${resource}`
    const { body, type } = params

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': type
      },
      body
    })
    console.log(':::response', response)

    return {
      data: response
    }
  },

  resetData: async (resource: string) => {
    console.log({ resource })
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/resetData`

    const request = new Request(`${url}`, {
      method: 'GET',
      headers: new Headers(HEADERS)
    })
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log({ data })

    return {
      data: response
    }
  },

  synchData: async (resource: string) => {
    console.log({ resource })
    const url = `${validUrlApi(resource) ? apiUrlDesktopApp : apiUrlApp}/${resource}/synch`

    const request = new Request(`${url}`, {
      method: 'GET',
      headers: new Headers(HEADERS)
    })
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log({ data })

    return {
      data: response
    }
  }

  // GetUserLogin: async (resource: string, params: GetPutPresignedUrlparams) => {
  //   const url = `${validUrlApi(resource) ? apiUrlDesktopApp :  apiUrlApp}/${resource}`;
  //   const body = JSON.stringify(params.data);

  //   const response = await httpClient(url, {
  //     method: 'POST',
  //     body,
  //   });

  //   const {
  //     json: { presignedUrl },
  //   } = response;

  //   return {
  //     data: { presignedUrl },
  //   };
  // },
}

export default baseDataProvider
