interface Trade {
    id: number;
    make: string;
    price: number;
    mileage?: number;
    sellerType?: string;
    contactDates: Number[];     // API may return number[] and Frontend can represent in user friendly date format
}

export default Trade;