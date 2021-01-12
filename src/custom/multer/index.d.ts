import User from '../../models/User';

declare global {
	namespace Express {
		namespace Multer {
			/** Object containing file metadata and access information. */
			interface File {
				location?: string;
			}
		}
	}
}
