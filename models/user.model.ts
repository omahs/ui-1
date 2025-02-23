import mongoose from 'mongoose'

import type { INftDoc } from './nft.model'
import type { IProjectDoc } from './project.model'
import type { IStemDoc } from './stem.model'

type Avatar = {
	base64: string
	imageFormat: string
}

export interface IUserIdentity {
	commitment: string
	nullifier: string
	trapdoor: string
	votingGroupId: number
}

export interface IUser {
	address: string
	displayName: string
	avatar: Avatar
	nftIds: string[]
	projectIds: string[]
	stemIds: string[]
	createdAt: string
	updatedAt: string
	voterIdentities: IUserIdentity[]
	registeredGroupIds: number[]
}

export interface IUserFull extends IUser {
	nfts: INftDoc[]
	projects: IProjectDoc[]
	projectCollaborations: IProjectDoc[]
	stems: IStemDoc[]
}

export interface IUserDoc extends Document, IUser {}

const userSchema = new mongoose.Schema<IUserDoc>(
	{
		address: {
			type: String,
			required: true,
			// validate it is an ethereum-like address (Joi?)
			unique: true,
		},
		displayName: {
			type: String,
			required: false,
			trim: true,
			minLength: 3,
			maxlength: 50,
		},
		avatar: {
			type: Object,
			required: false,
		},
		nftIds: {
			type: [String],
			required: false,
			default: [],
		},
		projectIds: {
			type: [String],
			required: false,
			default: [],
		},
		stemIds: {
			type: [String],
			required: false,
			default: [],
		},
		// Semaphore identities across multiple projects
		voterIdentities: {
			type: [Object],
			required: false,
			default: [],
		},
		registeredGroupIds: {
			type: [Number],
			required: false,
			default: [],
		},
	},
	{ timestamps: true },
)

export const User = mongoose.models.user || mongoose.model<IUserDoc>('user', userSchema)
