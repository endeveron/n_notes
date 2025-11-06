import { ObjectId } from 'mongoose';

export type Quote = {
  quote: string;
  author?: string;
  transcription?: string;
  translation?: string;
};

export type QuoteDB = Quote & { _id: ObjectId };
export type ParsedQuote = Quote & { id: string };
