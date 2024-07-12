import type { DataProvider } from 'react-admin';

const fakeProvider: DataProvider = {
  // get a list of records based on sort, filter, and pagination
  getList: (resource, params) => Promise.resolve(),
  // get a single record by id
  getOne: (resource, params) => Promise.resolve(),
  // get a list of records based on an array of ids
  getMany: (resource, params) => Promise.resolve(),
  // get the records referenced to another record, e.g. comments for a post
  getManyReference: (resource, params) => Promise.resolve(),
  // create a record
  create: (resource, params) => Promise.resolve(),
  // update a record based on a patch
  update: (resource, params) => Promise.resolve(),
  // update a list of records based on an array of ids and a common patch
  updateMany: (resource, params) => Promise.resolve(),
  // delete a record by id
  delete: (resource, params) => Promise.resolve(),
  // delete a list of records based on an array of ids
  deleteMany: (resource, params) => Promise.resolve(),
};

export default fakeProvider;
