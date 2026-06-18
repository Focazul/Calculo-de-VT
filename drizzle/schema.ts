import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  cpf: text("cpf").notNull(),
  position: text("position").notNull(),
  busLine: text("bus_line").notNull(),
  vtValue: text("vt_value").notNull(), // Valor unitário, usado se precisar calcular custo financeiro
  startDate: text("start_date"),
  phone: text("phone"),
  status: text("status").default("OK").notNull(),
  // Novas colunas para o cálculo automático
  folgasSemanais: integer("folgas_semanais").default(1), // 1 ou 2
  passesPorDia: integer("passes_por_dia").default(2),   // Quantos passes usa por dia
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("open_id").unique().notNull(),
  name: text("name"),
  email: text("email"),
  role: text("role").default("user"),
  lastSignedIn: integer("last_signed_in", { mode: "timestamp" }),
  loginMethod: text("login_method"),
});

export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").references(() => employees.id),
  purchaseDate: text("purchase_date").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  // Agora armazenamos a quantidade de passes calculada
  totalCalculatedValue: text("total_calculated_value").notNull(), 
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "cancelled"] }).default("pending"),
  notes: text("notes"),
});

export type InsertEmployee = typeof employees.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type InsertPurchase = typeof purchases.$inferInsert;