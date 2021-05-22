'use strict';
const { generateKeyPair, randomBytes } = require('crypto');
const { Model, Op } = require('sequelize');

function generateKeyPairPromise(passphrase, modulusLength = 2048) {
	if (!passphrase) {
		passphrase = randomBytes(16).toString('hex');
	}

	return new Promise(async (resolve, reject) => {
		generateKeyPair(
			'rsa',
			{
				modulusLength,
				publicKeyEncoding: {
					type: 'spki',
					format: 'pem'
				},
				privateKeyEncoding: {
					type: 'pkcs8',
					format: 'pem',
					cipher: 'aes-256-cbc',
					passphrase
				}
			},
			(err, publicKey, privateKey) => {
				if (err) {
					reject(err);
				} else {
					resolve({ publicKey, privateKey, passphrase });
				}
			}
		);
	});
}

module.exports = (sequelize, DataTypes) => {
	class keyPairs extends Model {
		// Keys should last a year at most
		static maxAge = 1000 * 60 * 60 * 24 * 365;

		// Stop signing with the current key if there's less than thirty days till expiration
		static signingBuffer = 1000 * 60 * 60 * 24 * 30;

		static async getSigningKey() {
			const latestExpiration = new Date(Date.now() + this.signingBuffer);

			let key = await keyPairs.findOne({
				where: {
					expiration: {
						[Op.gt]: latestExpiration
					}
				}
			});

			if (!key) {
				key = await this.getNewKeyPair();
			}

			return key;
		}

		static async getNewKeyPair() {
			const expiration = new Date(Date.now() + this.maxAge);
			const {
				publicKey,
				privateKey,
				passphrase
			} = await generateKeyPairPromise();

			return await keyPairs.create({
				publicKey,
				privateKey,
				passphrase,
				expiration
			});
		}

		static async getValidKeyPairs() {
			return await keyPairs.findAll({
				where: {
					expiration: {
						[Op.gt]: new Date()
					}
				}
			});
		}
	}
	keyPairs.init(
		{
			privateKey: DataTypes.TEXT,
			publicKey: DataTypes.TEXT,
			passphrase: DataTypes.STRING,
			expiration: DataTypes.DATE
		},
		{
			sequelize,
			modelName: 'keyPairs'
		}
	);
	return keyPairs;
};
