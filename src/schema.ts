import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

type Chat = {
  history: Body[];
};

type Body = {
  role: string;
  message: string;
};

/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/

export const user = sqliteTable("user", {
  id: integer("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email"),
});

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey().notNull(),
  userId: integer("user_id").references(() => user.id),
});

export const conversation = sqliteTable("conversation", {
  id: integer("id").primaryKey().notNull(),
  parent: integer("parent").references(() => conversations.id),
  body: text("body", { mode: "json" }).$type<Chat>(),
});
