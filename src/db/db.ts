import Listing from '../models/listing';
import Trade from '../models/trade';

let listingMap = new Map<number, Listing>();
let contactMap = new Map<number, number[]>();     // listingId, date[]
let tradeMap = new Map<number, Trade>();


const getTradeById = (id: number): Trade => {
    return tradeMap.get(id) || {} as Trade;
}
const addTradeToMap = (sale: Trade) => {
    tradeMap.set(sale.id, sale);
}
const getAllTrades = (): Trade[] => {
    const trades = [];
    for (let trade of tradeMap.values()) {
        trades.push(trade);
    }
    return trades;
}


const getListingById = (listingId: number): Listing => {
    return listingMap.get(listingId) || {} as Listing;
}
const addListingToMap = (listing: Listing) => {
    listingMap.set(listing.id, listing);
}


const getContactsById = (listingId: number): number[] => {
    return contactMap.get(listingId) || [];
}
const addContactToMap = (contact: number, listingId: number) => {
    const contacts = contactMap.get(listingId) || [];
    contacts.push(contact)
    contactMap.set(listingId, contacts);
}
const addContactsToMap = (contacts: number[], listingId: number) => {
    contactMap.set(listingId, contacts.concat(contactMap.get(listingId) || []));
}


export default {
    addListingToMap, getListingById,
    addContactToMap, addContactsToMap, getContactsById,
    getAllTrades, addTradeToMap, getTradeById
}