import mongoose from 'mongoose';
import express from 'express';
import handleMongoError from '../../service/handleMongoError';

const Archive = mongoose.model('Archive');
const basePath = '/archive';
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/download/:id`, async (request, response) => {
		if (request.params.id != null) {
			let archive = await Archive.findOne({_id: request.params.id}).catch(handleMongoError);

			if (archive != null) {
				response.set({
					'Content-Type': archive.type,
					'Content-Disposition': 'inline; filename="' + archive.name + '"',
					'Content-Length': archive.size
				});

				response.write(archive.data, 'binary');
				response.end(null, 'binary');
				return;
			}
		}

		response.write('', 'binary');
		response.end(null, 'binary');
	});

	return router;
}