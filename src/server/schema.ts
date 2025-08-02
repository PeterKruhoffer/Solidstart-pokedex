import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { type DBPokemon } from "./pokemonApi";

export const pokemonTable = sqliteTable("pokemon_table", {
  id: integer().primaryKey({ autoIncrement: false }).unique(),
  name: text().notNull(),
  sprite: text().notNull(),
  types: text("types", { mode: "json" }).$type<DBPokemon["types"]>().notNull(),
});
