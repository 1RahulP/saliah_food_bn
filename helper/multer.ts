import multer from 'multer';
import path from 'path';
import * as fs from 'fs';
import { NextFunction, Request, Response } from 'express';

export const uploadDirectory = path.join(__dirname, '../', 'uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
}).array('files', 10);

export const updateFilesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
            const filePath = path.join(uploadDirectory, file.originalname);
            const fileExists = await fs.promises.access(filePath)
                .then(() => true)
                .catch(() => false);
            if (fileExists) {
                await fs.promises.writeFile(filePath, file.buffer);
            }
        }
        next();
    } catch (error) {
        console.error('Error updating files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




