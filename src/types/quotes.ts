export type QuoteInfo = {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string;
    ask: string;
    timestamp: string;
    create_date: string;
};

export type Quotes = {
    [id: string]: QuoteInfo;
};
