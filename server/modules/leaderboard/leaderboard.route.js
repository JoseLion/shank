import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';

const Leaderboard = mongoose.model('Leaderboard');
const Player = mongoose.model('Player');
const basePath = '/leaderboard';
const router = express.Router();
let leaderboard_service = require('./leaderboard.service');

export default function(app) {
	router.get(`${basePath}/findByTournament/:id`, auth, async (request, response) => {
        const leaderboard = await Leaderboard.find({tournament: request.params.id}).sort({rank: 1}).populate('player').catch(handleMongoError);
        
        leaderboard.sort((a, b) => {
            const x = a.rank ? a.rank : 999999;
            const y = b.rank ? b.rank : 999999;

            return x - y;
        });

		response.ok(leaderboard);
    });
    
    router.get(`${basePath}/playersCount`, auth, async (request, response) => {
        try {
            const players = await Player.find({pickCount: {$gte: 1}}).catch(handleMongoError);
            let total = 0;
            players.forEach(player => {
                total += player.pickCount;
            });

            response.ok(total);
        } catch (error) {
            response.server_error(error);
        }
    });
	
	router.post('/load_leaderboard', leaderboard_service.load_leaderboard);

	return router;
}