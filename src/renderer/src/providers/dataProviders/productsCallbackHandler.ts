import type {
  DataProvider,
  GetOneResult,

} from 'react-admin';
const productsCallbackHandler = {
  resource: 'products',

  afterGetOne: async (
    response: GetOneResult,
    dataProvider: DataProvider
  ): Promise<GetOneResult> => {

    const data = response.data;
    data.productThumbnail = {
      src: data.imageUrl,
      title: data.img.split('_').pop(),
    };



    return response;
  },
};

export default productsCallbackHandler;
