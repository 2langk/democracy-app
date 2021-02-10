import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Comment, Post, User, SubComment } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createPost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content, category } = req.body;
		const { school, id } = req.user!;

		if (
			['hearing', 'edu', 'notice'].includes(category) &&
			req.user!.role !== 'admin'
		)
			return next(new AppError('Error: Permission Denied', 400));

		const uploads = req.files as {
			images: Express.Multer.File[];
			video: Express.Multer.File[];
		};

		let image = '';
		let video = '';

		if (uploads.images) {
			uploads.images.forEach((i) => {
				image += `${i!.location!.split('public/')[1]},`;
			});
		}

		if (uploads.video) {
			// eslint-disable-next-line prefer-destructuring
			video = uploads.video[0].location!.split('public/')[1];
		}

		const newPost = await Post.create({
			title,
			content,
			school,
			category,
			video,
			image,
			userId: id
		});

		if (!newPost) return next(new AppError('Error: Cannot create post', 400));

		res.status(201).json({
			status: 'success',
			newPost
		});
	}
);

export const getAllPost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { page, category, searchParam, searchTerm } = req.query as {
			[fields: string]: string;
		};

		const admin = await User.findOne({
			where: { role: 'admin', school: req.user!.school }
		});

		if (!admin)
			return next(
				new AppError('Error: 관리자 미확인. 등록되지 않은 학교입니다.', 400)
			);

		let posts: Post[];

		if (searchTerm && searchParam) {
			posts = await Post.findAll({
				where: {
					school: req.user!.school,
					category,
					[searchParam]: {
						[Op.like]: `%${searchTerm}%`
					}
				},
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['name', 'photo', 'schoolClass']
					},
					{
						model: Comment,
						as: 'comment',
						attributes: ['id']
					}
				],
				order: [['createdAt', 'DESC']],
				limit: 10,
				offset: (+page - 1) * 10
			});
		} else {
			posts = await Post.findAll({
				where: {
					school: req.user!.school,
					category
				},
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['name', 'photo', 'schoolClass']
					},
					{
						model: Comment,
						as: 'comment',
						attributes: ['id']
					}
				],
				order: [['createdAt', 'DESC']],
				limit: 10,
				offset: (+page - 1) * 10
			});
		}

		posts = posts.map((post) => {
			const a = post.toJSON() as Post;
			a.commentCount = post.comment!.length;
			a.comment = undefined;
			return a;
		});

		res.status(201).json({
			status: 'success',
			posts
		});
	}
);

export const getOnePost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const admin = await User.findOne({
			where: { role: 'admin', school: req.user!.school }
		});

		if (!admin)
			return next(new AppError('Error: 등록되지 않은 학교입니다.', 400));

		const post = await Post.findByPk(req.params.id, {
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['name', 'schoolClass', 'photo']
				},
				{
					model: Comment,
					as: 'comment',
					attributes: ['id', 'content', 'updatedAt', 'userId'],
					include: [
						{
							model: User,
							as: 'user',
							attributes: ['name', 'schoolClass', 'photo']
						},
						{
							model: SubComment,
							as: 'subComment',
							attributes: ['id', 'content', 'updatedAt', 'userId'],
							include: [
								{
									model: User,
									as: 'user',
									attributes: ['name', 'schoolClass', 'photo']
								}
							]
						}
					]
				}
			]
		});

		if (!post || post.school !== req.user!.school)
			return next(new AppError('Error: Cannot find post', 400));

		post?.comment?.forEach((b: Comment) => {
			// eslint-disable-next-line no-param-reassign
			if (b.user?.password) {
				b.user.password = undefined;
			}
		});

		post.viewCount += 1;

		await post.save();

		post.image = (post.image as string).split(',');
		post.image.pop();

		res.status(201).json({
			status: 'success',
			post
		});
	}
);

export const updatePost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { title, content } = req.body;
		if (!title || !content)
			return next(new AppError('Error: please check title, content', 400));

		const uploads = req.files as {
			images: Express.Multer.File[];
			video: Express.Multer.File[];
		};

		let image = '';
		let video = '';

		if (uploads.images) {
			uploads.images.forEach((i) => {
				image += `${i!.location!.split('public/')[1]},`;
			});
		}

		if (uploads.video) {
			// eslint-disable-next-line prefer-destructuring
			video = uploads.video[0].location!.split('public/')[1];
		}

		const post = await Post.findByPk(req.params.id, {
			include: { model: User, as: 'user' }
		});

		if (!post || post!.userId !== req.user!.id)
			return next(new AppError('Error: permission Denied', 400));

		post.title = title;
		post.content = content;
		post.image = image === '' ? post.image : image;
		post.video = video === '' ? post.video : video;
		await post.save();

		res.status(201).json({
			status: 'success',
			post
		});
	}
);

export const deletePost = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const post = await Post.findByPk(req.params.id);

		if (req.user!.id !== post?.userId)
			return next(new AppError('Error: permission Denied', 400));

		await post.destroy();

		res.status(201).json({
			status: 'success'
		});
	}
);

export const createComment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { content } = req.body;

		if (!content)
			return next(new AppError('Error: please pass your comment', 400));

		const newComment = await Comment.create({
			content,
			postId: req.params.id,
			userId: req.user!.id
		});

		res.status(201).json({
			status: 'success',
			newComment
		});
	}
);

export const updateComment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const comment = await Comment.findOne({
			where: { postId: req.params.postId, id: req.params.id }
		});

		if (!comment || comment.userId !== req.user!.id)
			return next(new AppError('Error: Permission Denied', 400));

		comment.content = req.body.content || comment.content;

		await comment.save();

		res.status(201).json({
			status: 'success',
			comment
		});
	}
);

export const deleteComment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const comment = await Comment.findOne({
			where: { postId: req.params.postId, id: req.params.id }
		});

		if (!comment || comment.userId !== req.user!.id)
			return next(new AppError('Error: Permission Denied', 400));

		await comment.destroy();

		res.status(201).json({
			status: 'success'
		});
	}
);

export const createSubComment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { content } = req.body;

		if (!content)
			return next(new AppError('Error: please pass your comment', 400));

		const newSubComment = await SubComment.create({
			content,
			commentId: req.params.id,
			userId: req.user!.id
		});

		res.status(201).json({
			status: 'success',
			newSubComment
		});
	}
);

export const updateSubComment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { content } = req.body;

		if (!content)
			return next(new AppError('Error: please pass your comment', 400));

		const subComment = await SubComment.findByPk(req.params.id);

		if (!subComment || subComment.userId !== req.user!.id)
			return next(new AppError('Error: Permisison Denied', 400));

		subComment.content = content;

		await subComment.save();

		res.status(201).json({
			status: 'success',
			subComment
		});
	}
);

export const deleteSubComment = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const subComment = await SubComment.findByPk(req.params.id);

		if (!subComment || subComment.userId !== req.user!.id)
			return next(new AppError('Error: Permisison Denied', 400));

		await subComment.destroy();

		res.status(201).json({
			status: 'success'
		});
	}
);
