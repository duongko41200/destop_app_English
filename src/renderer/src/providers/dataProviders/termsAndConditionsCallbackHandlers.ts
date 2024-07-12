import { RecordValue } from '@repo/types/general';
import { generateFileName } from '@repo/utils/fileUtils';
import type {
  CreateParams,
  DataProvider,
  GetOneParams,
  GetOneResult,
  UpdateParams,
} from 'react-admin';
import { convertRASingleFileWithRaw } from '@repo/utils/fileUtils';
import { FieldValues } from 'react-hook-form';
import { downloadFile } from '@repo/lib/supabase';
import { convertBase64ToObjectUrl } from '@repo/utils/fileUtils';

const getPostDataWithFile = async (values: FieldValues): Promise<FormData> => {
  const { files, ...data } = values;

  const formData = new FormData();

  if (files) {
    const { title, src } = await convertRASingleFileWithRaw(files);
    formData.append('filePath', src as File);
    formData.append('filePathName', title);
  }

  Object.entries(data).forEach(([key, value]) => {
    if (!formData.has(key)) {
      formData.append(key, value as string);
    }
  });

  return formData;
};
const termsAndConditionsCallbackHandler = {
  resource: 'terms_and_conditions',
  /**
   * Handles the beforeCreate lifecycle callback
   * @param params create params
   * @param dataProvider dataProvider
   * @returns CreateParams
   */
  beforeCreate: async (params: CreateParams) => {
    const { data } = params;
    console.log('beforeCreate', data);

    const postData = await getPostDataWithFile(data);

    params.data = postData;
    return params;
  },
  /**
   *  Handles the beforeUpdate lifecycle callback
   * @param params UpdateParams
   * @returns UpdateParams
   */
  beforeUpdate: async (params: UpdateParams) => {
    let { data } = params;
    console.log('beforeUpdate', data);
    delete data.fileUrl;
    delete data.filePath;

    const postData = await getPostDataWithFile(data);

    params.data = postData;
    return params;
  },

  /**
   * Handles the afterGetOne lifecycle callback
   * @param result GetOneResult
   * @returns GetOneResult
   */
  afterGetOne: async (result: GetOneResult) => {
    console.log('afterGetOne', result);

    const {
      data: { fileUrl },
    } = result;

    if (fileUrl) {
      const url = convertBase64ToObjectUrl(fileUrl);
      result.data.fileUrl = url;
    }
    return result;
  },
};

export default termsAndConditionsCallbackHandler;
