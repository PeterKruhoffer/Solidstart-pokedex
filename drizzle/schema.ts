import { sqliteTable, uniqueIndex, integer, text } from "drizzle-orm/sqlite-core"

export const pokemonTable = sqliteTable("pokemon_table", {
	id: integer().primaryKey().notNull(),
	name: text().notNull(),
	sprite: text().notNull(),
	types: text().notNull(),
},
	(table) => [
		uniqueIndex("pokemon_table_id_unique").on(table.id),
	]);
