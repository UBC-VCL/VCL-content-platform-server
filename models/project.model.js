import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * This is the schema for a Project in the VCL content platform.
 * 
 * Any updates to this schema MUST ALSO be made to the projectValidationSchema
 * in projectValidation.model.js!!
 */
const projectSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
		},
		members: [
			{
				type: mongoose.ObjectId,
				ref: 'User',
			},
		],
		isActive: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
);

mongoose.set('useFindAndModify', false);
const Project = mongoose.model('Project', projectSchema);
export default Project;
