import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * This is the schema for a Resource in the VCL content platform.
 */
const resourceSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		category: {
			type: {
				main: {
					type: String,
					required: true,
				},
				sub: {
					type: String,
				}
			},
		},
		author: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.ObjectId,
			ref: 'User',
			required: true,
		},
		resource_link: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

mongoose.set('useFindAndModify', false);
const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
