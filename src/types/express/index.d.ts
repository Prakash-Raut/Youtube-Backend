declare;
{
	namespace Express {
		export interface Request {
			user?: {
				_id?: string;
				username: string;
				email: string;
				fullName: string;
				avatar: string;
				coverImage: string;
				watchHistory: string[];
				password: string;
				refreshToken: string;
			};
			files?: {
				avatar?: FileDetails[];
				coverImage?: FileDetails[];
				videoFile?: FileDetails[];
				thumbnail?: FileDetails[];
			};
		}
	}
}

/* 
avatar: [
[1]     {
[1]       fieldname: 'avatar',
[1]       originalname: 'avatar.jpg',
[1]       encoding: '7bit',
[1]       mimetype: 'image/jpeg',
[1]       destination: './public/temp',
[1]       filename: 'avatar.jpg',
[1]       path: 'public\\temp\\avatar.jpg',
[1]       size: 99373
[1]     }
[1]   ],
[1]   coverImage: [
[1]     {
[1]       fieldname: 'coverImage',
[1]       originalname: 'back.jpg',
[1]       encoding: '7bit',
[1]       mimetype: 'image/jpeg',
[1]       destination: './public/temp',
[1]       filename: 'back.jpg',
[1]       path: 'public\\temp\\back.jpg',
[1]       size: 4094
[1]     }
[1]   ]

*/
