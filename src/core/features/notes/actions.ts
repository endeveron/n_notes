'use server';

// export const createNote = async (
//   quoteData: Quote
// ): Promise<ServerActionResult> => {
//   if (!quoteData?.quote) {
//     return handleActionError('createQuote: Invalid data provided');
//   }

//   console.log('quoteData', quoteData);

//   try {
//     await mongoDB.connect();

//     await QuoteModel.create(quoteData);

//     return {
//       success: true,
//     };
//   } catch (err: unknown) {
//     return handleActionError('Unable to create a new quote item in db', err);
//   }
// };

// export const getQuotes = async (): Promise<
//   ServerActionResult<ParsedQuote[]>
// > => {
//   try {
//     await mongoDB.connect();

//     const quotes = await QuoteModel.find<QuoteDB>({});

//     const parsedQuotes: ParsedQuote[] = quotes.map((q) => ({
//       id: q._id.toString(),
//       author: q.author,
//       quote: q.quote,
//       transcription: q.transcription,
//       translation: q.translation,
//     }));

//     return {
//       success: true,
//       data: parsedQuotes,
//     };
//   } catch (err: unknown) {
//     return handleActionError('Unable to retrieve quote items from the db', err);
//   }
// };

// export const deleteQuote = async (id: string): Promise<ServerActionResult> => {
//   if (!id) {
//     return handleActionError('deleteQuote: Invalid quote id');
//   }

//   try {
//     await mongoDB.connect();

//     await QuoteModel.findByIdAndDelete(id);

//     return {
//       success: true,
//     };
//   } catch (err: unknown) {
//     return handleActionError('Unable to delete quote item in db', err);
//   }
// };
