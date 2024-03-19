import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const memberSchema = new Schema(
	{
		// relates member to user. member document doesn't need to have an associated user
		name: {
			type: { firstname: String, lastname: String },
			trim: true,
			required: true,
		},
		project: {
			type: String,
			required: true
		},
		position: {
			type: String,
			required: true
		},
		contact: {
			type: {
				phoneNumber: {
					type: String,
					required: false,
				},
				linkedIn: {
					type: String,
					required: false,
				},
				email: {
					type: String,
					required: false,
				},
				required: true,
			},
		},
		blurb: {
			type: String,
			required: false
		},
		isAlumni: {
			type: Boolean,
			required: true,
		}
		// isActive: {
		//   type: Boolean,
		//   required: true,
		// },
		// firstName: {
		//   type: String,
		//   trim: true,
		//   required: true,
		// },
		// lastName: {
		//   type: String,
		//   trim: true,
		//   required: true,
		// },
		// email: {
		//   type: String,
		//   trim: true,
		// },
		// linkedIn: {
		//   type: String,
		//   trim: true,
		// }
	},
	{
		timestamps: true,
	}
);

mongoose.set('useFindAndModify', false);
const Member = mongoose.model('Member', memberSchema);
export default Member;
