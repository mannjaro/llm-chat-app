import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

type Chat = {
  history: Body[];
};

type Body = {
  role: "user" | "assistant";
  message: string;
};

/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/

export const user = sqliteTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email"),
});

export const userRelations = relations(user, ({ many }) => ({
  conversations: many(conversation),
}));

export const conversation = sqliteTable("conversation", {
  id: text("id").primaryKey().notNull(),
  userId: integer("userId"),
  body: text("body", { mode: "json" }).$type<Chat>(),
});

export const convsUserRelations = relations(conversation, ({ one }) => ({
  user: one(user, {
    fields: [conversation.userId],
    references: [user.id],
  }),
}));
