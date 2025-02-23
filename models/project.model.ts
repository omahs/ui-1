import mongoose, { Document } from 'mongoose'
import type { IStemDoc } from './stem.model'
import { stemSchema } from './stem.model'
import { IUserIdentity } from './user.model'

export interface IQueuedStem {
	stem: IStemDoc
	votes: number
}

export interface IProject {
	createdBy: string
	collaborators: string[]
	name: string
	description: string
	bpm: number
	trackLimit: number
	tags: string[]
	stems: IStemDoc[]
	queue: IQueuedStem[]
	votingGroupId: number
	voterIdentities: IUserIdentity[] // Should all pertain to this votingGroupId
}

export interface IProjectDoc extends Document, IProject {}

export const projectSchema = new mongoose.Schema<IProjectDoc>(
	{
		createdBy: {
			type: String,
			required: true,
		},
		collaborators: {
			type: [String],
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			minLength: 3,
			maxlength: 50,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			minLength: 1,
			maxLength: 300,
		},
		bpm: {
			type: Number,
			required: true,
			min: 0,
			max: 1000,
		},
		trackLimit: {
			type: Number,
			required: true,
			min: 0,
			max: 1000,
		},
		tags: {
			type: [String],
			required: false,
			default: [],
		},
		stems: {
			type: [stemSchema],
			required: false,
			default: [],
		},
		queue: {
			type: [{ stem: stemSchema, votes: Number }],
			required: false,
			default: [],
		},
		votingGroupId: {
			type: Number,
			required: true,
			min: 1,
		},
		voterIdentities: {
			type: [Object],
			required: true,
			default: [],
		},
	},
	{ timestamps: true },
)

// Require that projects have unique names
projectSchema.index({ name: 1 }, { unique: true })

export const Project = mongoose.models.project || mongoose.model<IProjectDoc>('project', projectSchema)
