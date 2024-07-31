'use strict';
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const keyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getIntoData } = require('../utils');
const {
	BadRequestError,
	AuthFailureError,
	ForbiddenError,
} = require('../cores/Error.response');
const { findByEmail } = require('./user.service');
const keytokenModel = require('../models/keytoken.model');
// const { LocalStorage } = require('node-localstorage');

// Tạo một kho lưu trữ local với đường dẫn tạm thời
// const localStorage = new LocalStorage('./scratch');

const RoleApp = {
	USER: 'USER',
	OWNER: 'OWNER',
	ADMIN: 'ADMIN',
};
class AccessService {
	/**
	 *
	 * check this token used
	 */

	static handleRefreshToken = async (refreshToken) => {
		const foundToken = await keyTokenService.findByRefreshTokenUsed(
			refreshToken
		);
		if (foundToken) {
			// decode xem là ai

			const { userId, email } = await verifyJWT(
				refreshToken,
				foundToken.privateKey
			);

			console.log({ userId, email });
			await keyTokenService.deleteKeyById(userId);
			throw new ForbiddenError('something warm heppend !! pls relogin');

	
		}

		const holderToken = await keyTokenService.findByRefreshToken( refreshToken )

		console.log({holderToken})
		if (!holderToken) throw new AuthFailureError('User not registerted')

		//verify Token
		const { userId, email } = await verifyJWT(
			refreshToken,
			holderToken.privateKey
		);

		const foundShop = await findByEmail({email})
		if (!foundShop) throw new AuthFailureError('User not registerted')


		//create 1 cap moi
		const tokens = await createTokenPair(
			{
				userId,
				email,
			},
			holderToken.publicKey,
			holderToken.privateKey
		);

		console.log({tokens})

		//update token

		await keytokenModel.updateOne({
			$set: {
				refreshToken: tokens.refreshToken
			},
			$addToSet: {
				refreshTokensUsed:refreshToken
			},
		})
		
		return {
			user: { userId, email },
			tokens
		}

		
		
	};


		/**
	 *
	 * check this token used
	 */

	static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
		const { userId, email } = user

		if (keyStore.refreshTokensUsed.includes(refreshToken)) {
			await keyTokenService.deleteKeyById(userId);
			throw new ForbiddenError('Something wrong happend!! Pls relogin');
		}

		if (keyStore.refreshToken !== refreshToken) {
			throw new AuthFailureError('User not registered');
		}


		const foundShop = await findByEmail({email})
		if (!foundShop) throw new AuthFailureError('User not registerted')


		//create 1 cap moi
		const tokens = await createTokenPair(
			{
				userId,
				email,
			},
			keyStore.publicKey,
			keyStore.privateKey
		);

		console.log({tokens})

		//update token

		await keytokenModel.updateOne({
			$set: {
				refreshToken: tokens.refreshToken
			},
			$addToSet: {
				refreshTokensUsed:refreshToken
			},
		})
		
		return {
			user,
			tokens
		}
	
	
			
			
		};

	static logout = async ({ keyStore }) => {
		console.log({ keyStore });
		const delKey = await keyTokenService.removeKeyId(keyStore._id);
		console.log({ delKey });
		return delKey;
	};

	// 1-check email in dbs
	// 2 - match pass
	// 3 - create AT vs RT and save
	// 4 - generate tokens
	// 5- get data return login

	static login = async ({ email, password, refreshToken = null }) => {
		//1
		const foundShop = await findByEmail({ email });
		if (!foundShop) throw new BadRequestError('shop not registered');

		//2
		const match = await bcrypt.compare(password, foundShop.password);
		if (!match) throw new AuthFailureError('Authentication failed');

		//3
		//create pivateKey, publicKey
		const privateKey = crypto.randomBytes(64).toString('hex');
		const publicKey = crypto.randomBytes(64).toString('hex');

		//4
		const tokens = await createTokenPair(
			{
				userId: foundShop._id,
				email,
			},
			publicKey,
			privateKey
		);

		await keyTokenService.createKeyToken({
			refreshToken: tokens.refreshToken,
			privateKey,
			publicKey,
			userId: foundShop._id,
		});

		return {
			user: getIntoData({
				fileds: ['_id', 'name', 'email'],
				object: foundShop,
			}),
			tokens,
		};
	};

	static signUp = async ({ name, email, password,idTelegram }) => {

		//step1: CHECK EMAIL EXIST?
		const holeUser = await userModel.find({ email }).lean();
		// console.log({ holeUser });
		if (holeUser.length > 0) {
			throw new BadRequestError('Error: shop already registered');
		}
		const passwordHash = await bcrypt.hash(password, 10);

		const newShop = await userModel.create({
			name,
			email,
			password: passwordHash,
			roles: [RoleApp.USER],
			idTelegram
			// idTelegram:localStorage.getItem('idTelegram')
		});

		if (newShop) {
			//create pivateKey, publicKey
			const privateKey = crypto.randomBytes(64).toString('hex');
			const publicKey = crypto.randomBytes(64).toString('hex');

			console.log({ privateKey, publicKey }); //save collection KeyStore

			//save collection KeyStore
			const KeyStore = await keyTokenService.createKeyToken({
				userId: newShop._id,
				publicKey,
				privateKey,
			});

			if (!KeyStore) {
				return {
					code: 'xxx',
					message: error.message,
					status: 'error',
				};
			}

			// create token pair
			const tokens = await createTokenPair(
				{
					userId: newShop._id,
					email,
				},
				publicKey,
				privateKey
			);

			return {

					user: getIntoData({
						fileds: ['_id', 'name', 'email'],
						object: newShop,
					}),
					tokens,
			
			};
		}
	};
}

module.exports = AccessService;
