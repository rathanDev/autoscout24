import express from 'express';
import tc from '../controllers/tradeController';
const router = express.Router();

router.get('/', tc.getAllTrades);
router.get('/average-selling-price', tc.getAverageSellingPricePerSellerType);
router.get('/percentual-distribution', tc.getPercentualDistributionByCarType);

export = router;