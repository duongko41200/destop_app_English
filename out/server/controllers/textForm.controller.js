'use strict';

const TextFormService = require('../services/textForm.service.js');
const { SuccessResponse, CREATED } = require('../cores/success.response.js');
const { URL_API } = require('../contant/Api/index.js');
const Redis = require('ioredis');
const dayjs = require('dayjs');


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
			message: "get  all ss textFrom success!",
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

        console.log((payload))		
		let dataRedis = await redis.get("Texts")

		let getData = JSON.parse(dataRedis)
		payload._id = getData?.length ?? 0
		payload.isRemind = true
		payload.repeat = 1
		payload.updatedAt = new Date().toISOString()
		payload.createdAt = new Date().toISOString()
		payload.dayReview = dayjs(new Date().toISOString()).add(1, 'day').format('YYYY/MM/DD')
		payload.userId = payload.attributes.userId
		getData?.push(payload)
		redis.set('Texts', JSON.stringify(getData))

		
		//add list create to ansync with app
		let data = await redis.get("Texts_Create")
		let redisData = JSON.parse(data) ??[]
		redisData=[...redisData,payload]
		redis.set('Texts_Create', JSON.stringify(redisData))


		return res.status(200).json({
			message: "get all creat textFrom success!",
			metadata:  payload,
			status:200
	
		
		})
	

	};
	
	deleteById = async (req, res, next) => {
		let textId = req.params

		let dataRedis = await redis.get("Texts")
		let getData = JSON.parse(dataRedis)??[]
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
			message: "get all delete textFrom success!",
			metadata: data[0] ,
			status:200
	
		
		})
	};

	getOneById = async (req, res, next) => {
		let textId = req.params

		let dataRedis = await redis.get("Texts")
		let getData = JSON.parse(dataRedis)

		let data = getData.filter((value, idx) => value._id == textId.id)
		if (data[0]?.typeText == "sentence") {
			data[0].structure = data[0]?.attributes.structure
			data[0].typeId = 1
		}
		if(data[0]?.typeText == "word") {
			data[0].typeId = 2
		}
			

		return res.status(200).json({
			message: "get all textFrom one success!",
			metadata: data[0],
			status:200
	
		
		})
	};
	
	updateOneById = async (req, res, next) => {
		let textId = req.params
		let body = req.body


		let dataRedis = await redis.get("Texts")
		let getData = JSON.parse(dataRedis)

		let data = getData.map((value, idx) => {
			if (value._id == textId.id) {
				value = body
			}

			return  value
		})
		redis.set('Texts', JSON.stringify(data))

		
		let dataCreate = await redis.get("Texts_Create")
		let redisCreate = JSON.parse(dataCreate) ?? []
		const elemTarget = redisCreate.find(elem => elem._id == textId.id) || null;
		if (elemTarget) {
			let filterData = redisCreate.map((value, idx) => {
				if (value._id == textId.id) {
					value = body
				}
	
				return  value
			})
			redis.set('Texts_Create', JSON.stringify(filterData))
		} else {
			
			let dataUpdate = await redis.get("Texts_Update")
			let redisData = JSON.parse(dataUpdate) ??[]
			redisData = [...redisData,body]
			redis.set('Texts_Update', JSON.stringify(redisData))


			console.log("redisData update",redisData)
		}


			

		return res.status(200).json({
			message: "update textFrom success!",
			metadata: data[0],
			status:200
	
		
		})
	};

	resetData = async (req, res, next) => {



		redis.del("Texts")
		redis.del("Texts_Create")
		redis.del("Texts_Delete")
		redis.del("Texts_Update")

			
		return res.status(200).json({
			message: "reset textFrom success!",
			metadata: 'ok',
			status:200
	
		
		})
	};

	synchData = async (req, res, next) => {

		const hearders = req.headers
		const HEADERS = {
			'Content-Type': 'application/json',
			'x-api-key': "4379e3b406e606110a01e8fbe364120fdc58be39a9f30431476dd53ad14b20fe66f52423a3e4546dfa272f4c389822299709414bb44b6b3ffce7f04292be2556",
			'x-client-id': hearders['x-client-id'],
			authorization: hearders['authorization'] 
		}
		const url = `${URL_API}/text/synch`

		let dataCreate = await redis.get("Texts_Create") ?? `[]`
		let dataDelete = await redis.get("Texts_Delete") ?? `[]`
		let dataUpdate = await redis.get("Texts_Update") ?? `[]`

		let body = { dataCreate, dataDelete, dataUpdate }

		console.log(dataCreate, dataDelete, dataUpdate )

		try {
			const request = new Request(`${url}`, {
				method: 'POST',
				headers:HEADERS,
				body: JSON.stringify(body)
			  })
			
	
			const resData = await fetch(request)
	
			let data = await resData.json()

			// const newDataAddId = data.metadata.map((value, idx) => {
				
			// 	value.id = idx

			// 	return value
			// })

			// redis.set('Texts', JSON.stringify(newDataAddId))

			redis.del("Texts")
			redis.del("Texts_Create")
			redis.del("Texts_Delete")
			redis.del("Texts_Update")
		
	
			return res.status(200).json({
				message: "Synch success!",
				metadata: 'ok',
				status:200
		
			
			})
			
		} catch (error) {
			return error
		}

			
		// return res.status(200).json({
		// 	message: "reset textFrom success!",
		// 	metadata: 'ok',
		// 	status:200
	
		
		// })
	};

	



	//END QUERY
}

module.exports = new TextFormController();
