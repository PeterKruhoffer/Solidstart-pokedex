CREATE TABLE `pokemon_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sprite` text NOT NULL,
	`types` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pokemon_table_id_unique` ON `pokemon_table` (`id`);