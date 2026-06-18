import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function generateUniqueCPF(): string {
  return Math.random().toString().substring(2, 13).padEnd(11, "0");
}

describe("employees", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should list all employees", async () => {
    const result = await caller.employees.list({});
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    if (result.length > 0) {
      const employee = result[0];
      expect(employee).toHaveProperty("id");
      expect(employee).toHaveProperty("name");
      expect(employee).toHaveProperty("cpf");
      expect(employee).toHaveProperty("position");
      expect(employee).toHaveProperty("busLine");
      expect(employee).toHaveProperty("vtValue");
      expect(employee).toHaveProperty("status");
    }
  });

  it("should filter employees by status", async () => {
    const result = await caller.employees.list({ status: "active" });
    
    expect(Array.isArray(result)).toBe(true);
    result.forEach((emp: any) => {
      expect(emp.status).toBe("active");
    });
  });

  it("should filter employees by name", async () => {
    const allEmployees = await caller.employees.list({});
    
    if (allEmployees.length > 0) {
      const firstEmployee = allEmployees[0];
      const searchName = firstEmployee.name.substring(0, 3);
      
      const result = await caller.employees.list({ name: searchName });
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach((emp: any) => {
        expect(emp.name.toLowerCase()).toContain(searchName.toLowerCase());
      });
    }
  });

  it("should create an employee", async () => {
    const newEmployee = {
      name: "Test Employee " + Date.now(),
      cpf: generateUniqueCPF(),
      position: "Developer",
      busLine: "Line 123",
      vtValue: "150.00",
    };

    const result = await caller.employees.create(newEmployee);
    
    expect(result).toHaveProperty("id");
    expect(result.name).toBe(newEmployee.name);
    expect(result.cpf).toBe(newEmployee.cpf);
    expect(result.position).toBe(newEmployee.position);
    expect(result.busLine).toBe(newEmployee.busLine);
    expect(result.vtValue).toBe(newEmployee.vtValue);
    expect(result.status).toBe("active");
  });

  it("should get employee by id", async () => {
    const allEmployees = await caller.employees.list({});
    
    if (allEmployees.length > 0) {
      const firstEmployee = allEmployees[0];
      const retrieved = await caller.employees.get({ id: firstEmployee.id });
      
      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(firstEmployee.id);
      expect(retrieved.name).toBe(firstEmployee.name);
    }
  });

  it("should update an employee", async () => {
    const newEmployee = {
      name: "Update Test " + Date.now(),
      cpf: generateUniqueCPF(),
      position: "QA",
      busLine: "Line 456",
      vtValue: "200.00",
    };

    const created = await caller.employees.create(newEmployee);

    const updated = await caller.employees.update({
      id: created.id,
      name: "Updated Name",
      position: "Senior QA",
    });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Updated Name");
    expect(updated.position).toBe("Senior QA");
  });
});
