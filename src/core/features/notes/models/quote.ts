import { Schema, model, models } from 'mongoose';

import { Quote } from '@/core/features/notes/types';

const quoteSchema = new Schema<Quote>(
  {
    author: { type: String },
    quote: { type: String, required: true },
    transcription: { type: String },
    translation: { type: String },
  },
  {
    versionKey: false,
  }
);

const QuoteModel = models.Quote || model('Quote', quoteSchema);

export default QuoteModel;
