import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userUploads = pgTable('user_uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 1000 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiProcessingResults = pgTable('ai_processing_results', {
  id: uuid('id').primaryKey().references(() => userUploads.id, { onDelete: 'cascade' }),
  aiQuestion: text('ai_question').notNull(),
  aiSolution: text('ai_solution').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userUploadsRelations = relations(userUploads, ({ one }) => ({
  aiProcessingResult: one(aiProcessingResults, {
    fields: [userUploads.id],
    references: [aiProcessingResults.id],
  }),
}));

export const aiProcessingResultsRelations = relations(aiProcessingResults, ({ one }) => ({
  userUpload: one(userUploads, {
    fields: [aiProcessingResults.id],
    references: [userUploads.id],
  }),
}));

export type UserUpload = typeof userUploads.$inferSelect;
export type NewUserUpload = typeof userUploads.$inferInsert;
export type AiProcessingResult = typeof aiProcessingResults.$inferSelect;
export type NewAiProcessingResult = typeof aiProcessingResults.$inferInsert;