import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { getUserId } from '../utils/getUserId'

interface MatchBody {
	team2Id: string
	activityId: string
	startedAt: string
	team1Score: number
	team2Score: number
}

export async function matches(app: FastifyInstance) {
	app.post('/matches', async (request, reply) => {
		const userId = await getUserId(request)

		const { team2Id, activityId, startedAt, team1Score, team2Score } =
			request.body as MatchBody

		const team = await prisma.team.findFirst({
			where: {
				leaderId: userId,
			},
		})

		if (!team) {
			reply.code(400).send({ message: 'Team not found' })
			return
		}

		//check if match already exists on this activity
		const matchExists = await prisma.match.findFirst({
			where: {
				OR: [
					{
						team1Id: team.id,
						team2Id,
						activityId,
					},
					{
						team1Id: team2Id,
						team2Id: team.id,
						activityId,
					},
				],
			},
		})

		if (matchExists) {
			reply.code(400).send({ message: 'Match already exists' })
			return
		}

		await prisma.match.create({
			data: {
				team1Id: team.id,
				team2Id,
				activityId,
				startedAt: new Date(startedAt),
				team1Score,
				team2Score,
			},
		})

		reply.code(201).send({ message: 'Match created' })
	})

	app.get('/matches/me', async (request, reply) => {
		const userId = await getUserId(request)

		const team = await prisma.team.findFirst({
			where: {
				leaderId: userId,
			},
		})

		if (!team) {
			reply.code(400).send({ message: 'Team not found' })
			return
		}

		const matchs = await prisma.match.findMany({
			where: {
				OR: [
					{
						team1Id: team.id,
					},
					{
						team2Id: team.id,
					},
				],
			},
			orderBy: {
				startedAt: 'desc',
			},
			include: {
				team1: true,
				team2: true,
				activity: true,
			},
		})

		reply.send(
			matchs.map((match) => ({
				id: match.id,
				team1: match.team1.name,
				team2: match.team2.name,
				activity: match.activity.name,
				startedAt: match.startedAt,
				team1Score: match.team1Score,
				team2Score: match.team2Score,
			}))
		)
	})

	app.get('/matches', async (request, reply) => {
		const { teamId } = request.query as { teamId?: string }

		const matchs = await prisma.match.findMany({
			...(!!teamId && {
				where: {
					OR: [
						{
							team1Id: teamId,
						},
						{
							team2Id: teamId,
						},
					],
				},
			}),
			include: {
				team1: true,
				team2: true,
				activity: true,
			},
			orderBy: {
				startedAt: 'desc',
			},
		})

		if (!matchs) {
			reply.code(400).send({ message: 'No match found' })
			return
		}

		reply.send(
			matchs.map((match) => ({
				id: match.id,
				team1: match.team1.name,
				team2: match.team2.name,
				activity: match.activity.name,
				startedAt: match.startedAt,
				team1Score: match.team1Score,
				team2Score: match.team2Score,
			}))
		)
	})

	app.delete('/matches/:matchId', async (request, reply) => {
		const userId = await getUserId(request)
		const { matchId } = request.params as { matchId: string }

		const team = await prisma.team.findFirst({
			where: {
				leaderId: userId,
			},
		})

		if (!team) {
			reply.code(400).send({ message: 'Team not found' })
			return
		}

		const match = await prisma.match.findFirst({
			where: {
				id: matchId,
				team1Id: team.id,
			},
		})

		if (!match) {
			reply.code(400).send({
				message:
					'Match not found. You may not have permission to delete it.',
			})
			return
		}

		await prisma.match.delete({
			where: {
				id: matchId,
			},
		})

		reply.send({ message: 'Match deleted' })
	})
}
