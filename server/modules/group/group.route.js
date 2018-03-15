import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';
import Constants from '../../config/constants';

const Group = mongoose.model('Group');
const basePath = '/group';
const router = express.Router();

const fileConfig = multer.diskStorage({
	destination: function(request, file, callback) {
		let path = `${Constants.photoPath}groups/${request.payload._id}`;
		ds1.mkdirsSync(path);
		callback(null, path);
	},
	filename: function(request, file, callback) {
		callback(null, file.originalname);
	}
});

export default function(app) {
	router.post(`${basePath}/create`, auth, async (request, response) => {
		let group = await Group.create(request.body).catch(handleMongoError);
		
		if (!group) {
			response.serverError();
		}

		response.ok(group);
	});

	return router;
}