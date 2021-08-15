import { Request, Response, NextFunction } from 'express';
import { stringify } from 'querystring';
import db from '../db/db';
import Trade from '../models/trade';

const getAllTrades = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`Get all trades`);
    const trades: Trade[] = db.getAllTrades();
    return res.status(200).json({
        data: trades
    });
};

const getAverageSellingPricePerSellerType = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`Get average selling price`);
    const trades: Trade[] = db.getAllTrades();

    const privateSellerTrades = trades.filter(t => t.sellerType === 'private');
    const dealerSellerTrades = trades.filter(t => t.sellerType === 'dealer');
    const otherSellerTrades = trades.filter(t => t.sellerType === 'other');

    const privateTotal = privateSellerTrades
        .map(t => t.price)
        .reduce((acc, cv) => acc + cv);
    const privateAvg = privateTotal / privateSellerTrades.length;

    const dealerTotal = dealerSellerTrades
        .map(t => t.price)
        .reduce((acc, cv) => acc + cv);
    const dealerAvg = dealerTotal / dealerSellerTrades.length;

    const otherTotal = otherSellerTrades
        .map(t => t.price)
        .reduce((acc, cv) => acc + cv);
    const otherAvg = otherTotal / otherSellerTrades.length;

    return res.status(200).json({
        result: [
            {
                sellerType: 'private',
                averageInEuro: privateAvg
            },
            {
                sellerType: 'dealer',
                averageInEuro: dealerAvg
            },
            {
                sellerType: 'other',
                averageInEuro: otherAvg
            }
        ]
    });
};

const getPercentualDistributionByCarType = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`Get percentual distribution by car type`);
    
    const trades: Trade[] = db.getAllTrades();
    let makes: string[] = trades.map(t => t.make);
    let makeSet = new Set<string>(makes);
    const totalCount = makes.length;
    let list = [];

    for (let make of makeSet) {
        const count = makes.filter(m => m === make).length;
        const percent = (count / totalCount) * 100;
        list.push({ make: make, percent: percent });
    }

    return res.status(200).json({
        result: list
    });
};

export default { getAllTrades, getAverageSellingPricePerSellerType, getPercentualDistributionByCarType };


