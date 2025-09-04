import Media from '../models/Media.js';
import catchAsync from '../utils/catchAsync.js';
import httpStatus from 'http-status';

export const saveUpload = catchAsync(async (req, res) => {
    const file = req.file;
    const { leadId, context } = req.body;
    const url = `${process.env.BASE_URL}/uploads/${file.filename}`;
    const media = await Media.create({ url, originalName: file.originalname, mimeType: file.mimetype, uploadedBy: req.user.id, lead: leadId, context });
    res.status(httpStatus.CREATED).json({ media });
});
