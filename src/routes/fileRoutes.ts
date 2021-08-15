import express from 'express';
import fc from '../controllers/fileController';
import multer from 'multer';
const upload = multer({ dest: './uploads/' })
const router = express.Router();

router.get('/', fc.getPage);
router.post('/upload', upload.single('dataFile'), fc.uploadFile);

export = router;