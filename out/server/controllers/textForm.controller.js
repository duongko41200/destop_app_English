'use strict';

const TextFormService = require('../services/textForm.service.js');
const { SuccessResponse, CREATED } = require('../cores/success.response.js');
const { URL_API } = require('../contant/Api/index.js');
const Redis = require('ioredis');


const redis = new Redis();

// import { HEADERS } from '../../../src/renderer/src/consts/header';

class TextFormController {
	// createTextForm = async (req, res, next) => {
	// 	console.log('data req:', req.body);

	// 	new SuccessResponse({
	// 		message: 'creat new textFrom success!',
	// 		metadata: await TextFormService.createTextForm(
	// 			req.body.typeText,
	// 			{ ...req.body, userId: req.user.userId }
	// 		),
	// 	}).send(res);
	// };

	//QUERY//
	/**
	 * @desc get all data word , sentence
	 * @param {Number} Limit
	 * @param {Number} skip
	 */


	getAllWithQuery = async (req, res, next) => {

		const params = req.query;
		const hearders = req.headers
		const HEADERS = {
			'Content-Type': 'application/json',
			'x-api-key': "4379e3b406e606110a01e8fbe364120fdc58be39a9f30431476dd53ad14b20fe66f52423a3e4546dfa272f4c389822299709414bb44b6b3ffce7f04292be2556",
			'x-client-id': hearders['x-client-id'],
			authorization: hearders['authorization'] 
		}
		
		const requestParams = `sort=${params.sort}&&range=${params.range}&&filter=${params.filter}`

		const url = `${URL_API}/text?${requestParams}`

		const dataRedis = await redis.get("Texts")

		if (dataRedis) return res.status(200).json({
			message: "get all textFrom success!",
			metadata: JSON.parse(dataRedis),
			status:200
		
		
		})


		try {

			const request = new Request(`${url}`, {
				method: 'GET',
				headers: new Headers(HEADERS)
			  })
			
	
			const resData = await fetch(request)
	
			const data = await resData.json()
	


			const newDataAddId = data.metadata.map((value, idx) => {
				
				value.id = idx

				return value
			})

			redis.set('Texts', JSON.stringify(newDataAddId))
		
	
			return res.status(200).json({
						 ...data
			})

			
		} catch (error) {
			return error
		}


	};

	create = async (req, res, next) => {

		const payload = req.body;
		
		let dataRedis = await redis.get("Texts")

		let getData = JSON.parse(dataRedis)
		payload._id = getData.length
		getData.push(payload)
		redis.set('Texts', JSON.stringify(getData))

		
		//add list create to ansync with app
		let data = await redis.get("Texts_Create")
		let redisData = JSON.parse(data) ??[]
		redisData=[...redisData,payload]
		redis.set('Texts_Create', JSON.stringify(redisData))


		return res.status(200).json({
			message: "get all textFrom success!",
			metadata:  payload,
			status:200
	
		
		})
	

	};
	
	deleteById = async (req, res, next) => {
		let textId = req.params

		let dataRedis = await redis.get("Texts")
		let getData = JSON.parse(dataRedis)
		let data = getData.filter((value, idx) => value._id === textId.id)
		let filterData = getData.filter((value, idx) => value._id != textId.id)
		redis.set('Texts', JSON.stringify(filterData))

		/**
		 * B1: check exist in Texts_Create , if OK -> upgrade again
		 * B2: if NG -> add Texts_Delete
		 */

		let dataCreate = await redis.get("Texts_Create")
		let redisCreate = JSON.parse(dataCreate) ?? []
		const elemTarget = redisCreate.find(elem => elem._id == textId.id) || null;
		if (elemTarget) {
			let filterData = redisCreate.filter((value, idx) => value._id != textId.id)
			redis.set('Texts_Create', JSON.stringify(filterData))
		} else {
			
			let dataDelete = await redis.get("Texts_Delete")
			let redisData = JSON.parse(dataDelete) ??[]
			redisData = [...redisData, ...data]
			redis.set('Texts_Delete', JSON.stringify(redisData))
		}


		return res.status(200).json({
			message: "get all textFrom success!",
			metadata: data[0] ,
			status:200
	
		
		})
	};

	getOneById = async (req, res, next) => {
		let textId = req.params

		let dataRedis = await redis.get("Texts")
		let getData = JSON.parse(dataRedis)
		let data = getData.filter((value, idx) => value._id === textId.id)


		return res.status(200).json({
			message: "get all textFrom success!",
			metadata: data[0] ,
			status:200
	
		
		})
	  };
	



	//END QUERY
}

module.exports = new TextFormController();
