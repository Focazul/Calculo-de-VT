CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`cpf` text NOT NULL,
	`position` text NOT NULL,
	`bus_line` text NOT NULL,
	`vt_value` text NOT NULL,
	`start_date` text,
	`phone` text,
	`status` text DEFAULT 'OK' NOT NULL,
	`folgas_semanais` integer DEFAULT 1,
	`passes_por_dia` integer DEFAULT 2
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer,
	`purchase_date` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`total_calculated_value` text NOT NULL,
	`payment_status` text DEFAULT 'pending',
	`notes` text,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`open_id` text NOT NULL,
	`name` text,
	`email` text,
	`role` text DEFAULT 'user',
	`last_signed_in` integer,
	`login_method` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_open_id_unique` ON `users` (`open_id`);