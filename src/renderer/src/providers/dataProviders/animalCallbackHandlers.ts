import type {
  CreateResult,
  DataProvider,
  DeleteResult,
  GetManyReferenceResult,
  UpdateParams,
  UpdateResult,
} from 'react-admin';
import { UpdateAnimalClassificationCount } from '@repo/types/dataProvider';

const updateAnimalClassificationCount = async ({
  classificationId,
  dataProvider,
  decrement,
}: UpdateAnimalClassificationCount) => {
  const { total }: GetManyReferenceResult = await dataProvider.getManyReference(
    'animals',
    {
      target: 'classificationId',
      id: classificationId,
      pagination: { page: 1, perPage: Number.MAX_SAFE_INTEGER },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    }
  );

  const { data: animalClassifications } = await dataProvider.getOne(
    'animal_classifications',
    {
      id: classificationId,
    }
  );

  const animalCount = decrement ? (total ? total - 1 : 0) : total;

  dataProvider.update('animal_classifications', {
    id: classificationId,
    data: {
      animalCount,
    },
    previousData: animalClassifications,
  });
};

const animalCallbackHandler = {
  resource: 'animals',
  /**
   * Handles the afterCreate lifecycle callback
   * Update the animalCount of the classification
   * @param response create response
   * @param dataProvider dataProvider
   * @returns response
   */
  afterCreate: async (
    response: CreateResult,
    dataProvider: DataProvider
  ): Promise<CreateResult> => {
    const { classificationId } = response.data;
    await updateAnimalClassificationCount({ classificationId, dataProvider });
    return response;
  },

  /**
   * Handles the beforeUpdate lifecycle callback
   * Update the animalCount of the classification
   * @param params update params
   * @param dataProvider dataProvider
   * @returns update params
   */
  beforeUpdate: async (
    params: UpdateParams,
    dataProvider: DataProvider
  ): Promise<UpdateParams> => {
    const { id } = params;
    const {
      data: { classificationId },
    } = await dataProvider.getOne('animals', { id });
    await updateAnimalClassificationCount({
      classificationId,
      dataProvider,
      decrement: true,
    });
    return params;
  },

  /**
   * Handles the afterUpdate lifecycle callback
   * Update the animalCount of the classification
   * @param response update response
   * @param dataProvider  dataProvider
   * @returns response
   */
  afterUpdate: async (
    response: UpdateResult,
    dataProvider: DataProvider
  ): Promise<UpdateResult> => {
    const { classificationId } = response.data;
    await updateAnimalClassificationCount({ classificationId, dataProvider });
    return response;
  },

  /**
   * Handles the afterDelete lifecycle callback
   * Update the animalCount of the classification
   * @param response delete response
   * @param dataProvider dataProvider
   * @returns response
   */
  afterDelete: async (
    response: DeleteResult,
    dataProvider: DataProvider
  ): Promise<DeleteResult> => {
    const { classificationId } = response.data;
    await updateAnimalClassificationCount({
      classificationId,
      dataProvider,
    });
    return response;
  },
};

export default animalCallbackHandler;
