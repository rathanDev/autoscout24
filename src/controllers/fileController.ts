import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import db from '../db/db';
import Listing from '../models/listing';
import Trade from '../models/trade';

const LISTING_HEADERS = ["id", "make", "price", "mileage", "seller_type"];
const CONTACT_HEADERS = ["listing_id", "contact_date"];
;
const LISTING_HEADER_JSON = JSON.stringify(LISTING_HEADERS);
const CONTACT_HEADER_JSON = JSON.stringify(CONTACT_HEADERS);
;
const FILE_LISTINGS = "FILE_LISTINGS";
const FILE_CONTACTS = "FILE_CONTACTS";
const FILE_UNKNOWN = "FILE_UNKNOWN";

const getPage = async (req: Request, res: Response, next: NextFunction) => {
    return res.sendFile(__dirname + "index.html");
};

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`Upload file ${req.file}`);

    fs.readFile(path.join(__dirname, '../../' + req.file?.path), 'utf8', (error, data) => {
        if (error) {
            console.log(`Err ${error}`);
            return;
        }
        processFile(data);
        return res.status(200).json({
            result: "Successfully Uploaded!"
        });
    });
};

const processFile = (data: string) => {
    const rows: string[] = data.split('\n');

    const fileType = identifyFile(rows[0]);

    if (fileType === FILE_LISTINGS) processListingsFile(rows);
    if (fileType === FILE_CONTACTS) processContactsFile(rows);
    else {
        console.error(`File type ${fileType}`);
        return;
    }
}

const identifyFile = (headerRow: string): string => {
    console.log("Identify file");

    let re = /\"/gi; // remove quotes ""
    let headers = headerRow.replace(re, "").split(",");
    const headerJson = JSON.stringify(headers);

    if (headerJson === LISTING_HEADER_JSON) return FILE_LISTINGS;
    else if (headerJson === CONTACT_HEADER_JSON) return FILE_CONTACTS;
    else return FILE_UNKNOWN;
}

const processListingsFile = (rows: string[]) => {
    console.log(`Process listings file`);

    let listingIds = new Set<number>();

    for (let i = 1; i < rows.length; i++) {

        let re = /\"/gi; // remove quotes ""
        let row = rows[i].replace(re, "");

        try {
            const cols = row.split(',');

            const listingId = Number(cols[0]);

            const listing: Listing = {
                id: listingId,
                make: cols[1],
                price: Number(cols[2]),
                mileage: Number(cols[3]),
                sellerType: cols[4].replace("\r", ""),
            }

            db.addListingToMap(listing);
            listingIds.add(listingId);

        } catch (ex) {
            console.error(`Err processing listing row: ${ex}`);
        }
    }
    doAggregate(listingIds);
}

const processContactsFile = (rows: string[]) => {
    console.log(`Process contacts file`);

    let listingIds = new Set<number>();

    for (let i = 1; i < rows.length; i++) {

        let row = rows[i];
        try {
            const cols = row.split(',');

            const listingId = Number(cols[0]);
            const contactDate = Number(cols[1])

            db.addContactToMap(contactDate, listingId);
            listingIds.add(listingId);
        } catch (ex) {
            console.error(`Err processing contact row ${ex}`);
        }
    }
    doAggregate(listingIds);
}

const doAggregate = (ids: Set<number>) => {
    console.log(`Do Aggregate`);

    for (let id of ids) {
        const tradeContactDates = db.getTradeById(id)?.contactDates || [];
        const contactDates = db.getContactsById(id);
        const listing = db.getListingById(id);

        const trade: Trade = {
            id: listing.id,
            make: listing.make,
            price: listing.price,
            mileage: listing.mileage,
            sellerType: listing.sellerType,
            contactDates: tradeContactDates.concat(contactDates)
        }
        db.addTradeToMap(trade);
    }
}

export default {
    getPage,
    uploadFile
};


