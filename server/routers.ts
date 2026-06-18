import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getDashboardStats,
} from "./db";

const statusEnum = z.enum([
  "CARTÃO", 
  "VIA", 
  "DESISTIU", 
  "DESLIGADO", 
  "FALTANDO", 
  "NÃO OPTANTE", 
  "OK", 
  "TEM CARTÃO", 
  "VERIFICAR"
]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(() => {
      return {
        id: "local-admin-id",
        name: "Administrador Local",
        email: "admin@localhost.com",
        role: "admin"
      };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  employees: router({
    list: publicProcedure
      .input(
        z.object({
          name: z.string().optional(),
          position: z.string().optional(),
          status: statusEnum.optional(),
        })
      )
      .query(({ input }) => getEmployees(input)),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEmployeeById(input.id)),

    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          cpf: z.string(),
          position: z.string(),
          busLine: z.string(),
          vtValue: z.string(),
          startDate: z.string().optional(),
          phone: z.string().optional(),
          daysOff: z.string().optional(),
          status: statusEnum.optional(),
        })
      )
      .mutation(({ input }) => createEmployee(input as any)),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          cpf: z.string().optional(),
          position: z.string().optional(),
          busLine: z.string().optional(),
          vtValue: z.string().optional(),
          startDate: z.string().optional(),
          phone: z.string().optional(),
          daysOff: z.string().optional(),
          status: statusEnum.optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateEmployee(id, data as any);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteEmployee(input.id)),
  }),

  purchases: router({
    list: publicProcedure
      .input(
        z.object({
          employeeId: z.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          paymentStatus: z.enum(["pending", "paid", "cancelled"]).optional(),
        })
      )
      .query(({ input }) => getPurchases(input)),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getPurchaseById(input.id)),

    create: publicProcedure
      .input(
        z.object({
          employeeId: z.number(),
          purchaseDate: z.string(),
          quantity: z.number(),
          totalValue: z.string(),
          paymentStatus: z.enum(["pending", "paid", "cancelled"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => createPurchase(input as any)),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          employeeId: z.number().optional(),
          purchaseDate: z.string().optional(),
          quantity: z.number().optional(),
          totalValue: z.string().optional(),
          paymentStatus: z.enum(["pending", "paid", "cancelled"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updatePurchase(id, data as any);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePurchase(input.id)),
  }),

  dashboard: router({
    stats: publicProcedure.query(() => getDashboardStats()),
  }),
});

export type AppRouter = typeof appRouter;