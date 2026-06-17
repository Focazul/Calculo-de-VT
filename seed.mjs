import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const seedData = {
  employees: [
    {
      name: "Ana Silva",
      cpf: "12345678901",
      position: "Analista de Sistemas",
      busLine: "Linha 101",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Bruno Santos",
      cpf: "12345678902",
      position: "Desenvolvedor",
      busLine: "Linha 205",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Carla Oliveira",
      cpf: "12345678903",
      position: "Gerente de Projetos",
      busLine: "Linha 101",
      vtValue: "180.00",
      status: "active",
    },
    {
      name: "Diego Costa",
      cpf: "12345678904",
      position: "Designer",
      busLine: "Linha 305",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Elisa Ferreira",
      cpf: "12345678905",
      position: "Administradora",
      busLine: "Linha 101",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Fernando Gomes",
      cpf: "12345678906",
      position: "Desenvolvedor",
      busLine: "Linha 410",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Gabriela Martins",
      cpf: "12345678907",
      position: "Analista QA",
      busLine: "Linha 205",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Henrique Rocha",
      cpf: "12345678908",
      position: "Suporte Técnico",
      busLine: "Linha 101",
      vtValue: "120.00",
      status: "active",
    },
    {
      name: "Iris Pereira",
      cpf: "12345678909",
      position: "Coordenadora",
      busLine: "Linha 305",
      vtValue: "150.00",
      status: "inactive",
    },
    {
      name: "João Alves",
      cpf: "12345678910",
      position: "Desenvolvedor",
      busLine: "Linha 410",
      vtValue: "150.00",
      status: "active",
    },
    {
      name: "Karina Souza",
      cpf: "12345678911",
      position: "Analista de Dados",
      busLine: "Linha 205",
      vtValue: "150.00",
      status: "resigned",
    },
  ],
  purchases: [
    // Ana Silva
    { employeeId: 1, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 1, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 1, purchaseDate: "2026-05-12", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // Bruno Santos
    { employeeId: 2, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 2, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "pending" },
    { employeeId: 2, purchaseDate: "2026-05-12", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // Carla Oliveira
    { employeeId: 3, purchaseDate: "2026-05-26", quantity: 12, totalValue: "180.00", paymentStatus: "paid" },
    { employeeId: 3, purchaseDate: "2026-05-19", quantity: 12, totalValue: "180.00", paymentStatus: "paid" },
    { employeeId: 3, purchaseDate: "2026-05-12", quantity: 12, totalValue: "180.00", paymentStatus: "pending" },
    // Diego Costa
    { employeeId: 4, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 4, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // Elisa Ferreira
    { employeeId: 5, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "pending" },
    { employeeId: 5, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 5, purchaseDate: "2026-05-12", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // Fernando Gomes
    { employeeId: 6, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 6, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // Gabriela Martins
    { employeeId: 7, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 7, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "pending" },
    { employeeId: 7, purchaseDate: "2026-05-12", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // Henrique Rocha
    { employeeId: 8, purchaseDate: "2026-05-26", quantity: 8, totalValue: "120.00", paymentStatus: "paid" },
    { employeeId: 8, purchaseDate: "2026-05-19", quantity: 8, totalValue: "120.00", paymentStatus: "paid" },
    // Iris Pereira
    { employeeId: 9, purchaseDate: "2026-05-12", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    // João Alves
    { employeeId: 10, purchaseDate: "2026-05-26", quantity: 10, totalValue: "150.00", paymentStatus: "pending" },
    { employeeId: 10, purchaseDate: "2026-05-19", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
    { employeeId: 10, purchaseDate: "2026-05-12", quantity: 10, totalValue: "150.00", paymentStatus: "paid" },
  ],
};

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("🌱 Starting seed...");

    // Clear existing data
    await connection.execute("DELETE FROM purchases");
    await connection.execute("DELETE FROM employees");
    console.log("✓ Cleared existing data");

    // Insert employees
    for (const emp of seedData.employees) {
      await connection.execute(
        "INSERT INTO employees (name, cpf, position, busLine, vtValue, status) VALUES (?, ?, ?, ?, ?, ?)",
        [emp.name, emp.cpf, emp.position, emp.busLine, emp.vtValue, emp.status]
      );
    }
    console.log(`✓ Inserted ${seedData.employees.length} employees`);

    // Insert purchases
    for (const purchase of seedData.purchases) {
      await connection.execute(
        "INSERT INTO purchases (employeeId, purchaseDate, quantity, totalValue, paymentStatus) VALUES (?, ?, ?, ?, ?)",
        [purchase.employeeId, purchase.purchaseDate, purchase.quantity, purchase.totalValue, purchase.paymentStatus]
      );
    }
    console.log(`✓ Inserted ${seedData.purchases.length} purchases`);

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
