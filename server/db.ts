import { eq, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { InsertUser, users, employees, InsertEmployee, purchases, InsertPurchase } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db) {
    try {
      const client = createClient({ url: "file:sqlite.db" });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect to SQLite:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: any = { ...user };
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  
  await db.insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: values,
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployees(filters?: { name?: string; status?: string; }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.name) conditions.push(sql`${employees.name} LIKE ${`%${filters.name}%`}`);
  if (filters?.status) conditions.push(eq(employees.status, filters.status as any));

  return conditions.length > 0 
    ? db.select().from(employees).where(and(...conditions))
    : db.select().from(employees);
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createEmployee(data: InsertEmployee) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(employees).values(data as any);
  const created = await db.select().from(employees).where(eq(employees.cpf, data.cpf)).limit(1);
  return created[0] || null;
}

export async function updateEmployee(id: number, data: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) return null;
  await db.update(employees).set(data as any).where(eq(employees.id, id));
  const updated = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return updated[0] || null;
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(employees).where(eq(employees.id, id));
}

export async function getPurchases(filters?: { employeeId?: number; startDate?: string; endDate?: string; paymentStatus?: string; }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.employeeId) conditions.push(eq(purchases.employeeId, filters.employeeId));
  if (filters?.startDate) conditions.push(sql`${purchases.purchaseDate} >= ${filters.startDate}`);
  if (filters?.endDate) conditions.push(sql`${purchases.purchaseDate} <= ${filters.endDate}`);
  if (filters?.paymentStatus) conditions.push(eq(purchases.paymentStatus, filters.paymentStatus as any));

  return conditions.length > 0
    ? db.select().from(purchases).where(and(...conditions))
    : db.select().from(purchases);
}

export async function getPurchaseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(purchases).where(eq(purchases.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createPurchase(data: InsertPurchase) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(purchases).values(data as any);
}

export async function updatePurchase(id: number, data: Partial<InsertPurchase>) {
  const db = await getDb();
  if (!db) return null;
  return db.update(purchases).set(data as any).where(eq(purchases.id, id));
}

export async function deletePurchase(id: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(purchases).where(eq(purchases.id, id));
}

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { activeEmployees: 0, monthlyValue: 0, pendingPurchases: 0 };

  try {
    // Definindo "ativos" como aqueles que possuem cartão ou estão OK
    const activeCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(employees)
      .where(sql`${employees.status} IN ('OK', 'TEM CARTÃO', 'CARTÃO')`);

    const monthlyValue = await db
      .select({ total: sql<string>`COALESCE(SUM(${purchases.totalValue}), 0)` })
      .from(purchases);

    const pendingCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(purchases)
      .where(eq(purchases.paymentStatus, "pending"));

    return {
      activeEmployees: activeCount[0]?.count || 0,
      monthlyValue: parseFloat(monthlyValue[0]?.total || "0"),
      pendingPurchases: pendingCount[0]?.count || 0,
    };
  } catch {
    return { activeEmployees: 0, monthlyValue: 0, pendingPurchases: 0 };
  }
}