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
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult
} from 'react-admin'
import { fetchUtils } from 'react-admin'
// import removeEmptyProperties from '@repo/utils/removeEmptyProperties';
// import { exclude } from '@repo/utils/excludeKey';
import { GetPutPresignedUrlparams, PutObjectViaPresignedUrlParams } from '@/types/dataProvider'

const apiUrl = ` http/local:3000/api/cms`
const httpClient = fetchUtils.fetchJson

const baseDataProvider: DataProvider = {
  // get a list of records based on sort, filter, and pagination
  getList: async (resource: string, params: GetListParams): Promise<GetListResult> => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    console.log({ resource })
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter)
    }
    const url = `${apiUrl}/${resource}?${JSON.stringify(query)}`

    const {
      json: { metadata }
    } = await httpClient(url)
    console.log('metadata: ', metadata)

    return {
      data: metadata,
      total: parseInt(metadata?.length, 10)
    }
  },
  // get a single record by id
  getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
    console.log({ params })
    const url = `${apiUrl}/${resource}/${params.id}`
    const {
      json: { metadata }
    } = await httpClient(url)
    console.log('metadata: ', metadata)

    return {
      data: metadata
    }
  },
  // get a list of records based on an array of ids
  getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
    const url = `${apiUrl}/${resource}?id=${params.ids}`
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

    const url = `${apiUrl}/${resource}/refer?${query}`
    const {
      json: { metadata }
    } = await httpClient(url)

    return metadata
  },
  // create a record
  create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    const url = `${apiUrl}/${resource}`

    let body
    if (params.data instanceof FormData) {
      body = params.data
    } else {
      body = JSON.stringify(params.data)
    }

    const response = await httpClient(url, {
      method: 'POST',
      body
    })
    const {
      json: { metadata }
    } = response

    console.log(':::metadata', metadata)
    return {
      data: metadata
    }
  },

  createMany: async (resource: string, params: CreateParams): Promise<CreateResult> => {
    const url = `${apiUrl}/${resource}/batch`

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
    const url = `${apiUrl}/${resource}/${params.id}`

    let body
    if (params.data instanceof FormData) {
      body = params.data
    } else {
      body = JSON.stringify('tesst')
    }

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
    const url = `${apiUrl}/${resource}/batch`
    const {
      json: { metadata }
    } = await httpClient(url)

    return {
      data: metadata
    }
  },

  // update a list of records based on an array of ids and a common patch
  updateMany: async (resource: string, params: UpdateManyParams): Promise<UpdateManyResult> => {
    const url = `${apiUrl}/${resource}/batch`
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
    const url = `${apiUrl}/${resource}/${params.id}`
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
    const url = `${apiUrl}/${resource}/batch`
    const body = JSON.stringify(params.ids)

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
    const url = `${apiUrl}/${resource}`
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
  }

  // GetUserLogin: async (resource: string, params: GetPutPresignedUrlparams) => {
  //   const url = `${apiUrl}/${resource}`;
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
