import express from 'express';
import mongoose from 'mongoose';
import requestIp from 'request-ip';

const Acquisition = mongoose.model('Acquisition');
let router = express.Router();


export default function() {
	router.post('/acquisitions', (req, res) => {
		Acquisition.findOne({client_ip: requestIp.getClientIp(req)}).exec((err, acquisition) => {
			if (err) {
				return res.server_error();
			}
			
			//let ip = ( req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress );
			//let user_agent = req.headers['user-agent'];
			
			if (!acquisition) {
				Acquisition.create({client_ip: requestIp.getClientIp(req)}, () => {
					res.ok({});
				});
			}
			else {
				res.ok({});
			}
		});
	});
	
	return router;
}