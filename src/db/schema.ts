import { pgTable, uuid, varchar, boolean } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    completed: boolean('completed').notNull().default(false),
});