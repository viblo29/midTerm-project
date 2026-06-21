#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");

const program = new Command();
const FILE = "./expenses.json";

// ---------------- HELPERS ----------------

function getExpenses() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveExpenses(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ---------------- CREATE ----------------

program
  .command("add <category> <price>")
  .action((category, price) => {
    const expenses = getExpenses();

    if (Number(price) < 10) {
      console.log("❌ Price must be at least 10");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category,
      price: Number(price),
      createdAt: new Date().toISOString().split("T")[0]
    };

    expenses.push(newExpense);
    saveExpenses(expenses);

    console.log("✅ Created:", newExpense);
  });

// ---------------- READ (SHOW) ----------------

program
  .command("show")
  .option("--asc")
  .option("--desc")
  .option("-c, --category <category>")
  .option("--page <page>")
  .option("--limit <limit>")
  .action((options) => {
    let expenses = getExpenses();

    // FILTER by category
    if (options.category) {
      expenses = expenses.filter(
        e => e.category === options.category
      );
    }

    // SORT
    if (options.asc) {
      expenses.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    if (options.desc) {
      expenses.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // PAGINATION
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 5);

    const start = (page - 1) * limit;
    const end = start + limit;

    const result = expenses.slice(start, end);

    console.log(result);
  });

// ---------------- GET BY ID ----------------

program
  .command("get <id>")
  .action((id) => {
    const expenses = getExpenses();

    const item = expenses.find(
      e => e.id === Number(id)
    );

    if (!item) {
      console.log("❌ Not found");
      return;
    }

    console.log(item);
  });

// ---------------- UPDATE ----------------

program
  .command("update <id>")
  .option("--category <category>")
  .option("--price <price>")
  .action((id, options) => {
    const expenses = getExpenses();

    const item = expenses.find(
      e => e.id === Number(id)
    );

    if (!item) {
      console.log("❌ Not found");
      return;
    }

    if (options.category) {
      item.category = options.category;
    }

    if (options.price) {
      if (Number(options.price) < 10) {
        console.log("❌ Price must be >= 10");
        return;
      }
      item.price = Number(options.price);
    }

    saveExpenses(expenses);

    console.log("✅ Updated:", item);
  });

// ---------------- DELETE ----------------

program
  .command("delete <id>")
  .action((id) => {
    let expenses = getExpenses();

    const deleted = expenses.find(
      e => e.id === Number(id)
    );

    expenses = expenses.filter(
      e => e.id !== Number(id)
    );

    saveExpenses(expenses);

    console.log("🗑 Deleted:", deleted);
  });

// ---------------- SEARCH BY DATE ----------------

program
  .command("search <date>")
  .action((date) => {
    const expenses = getExpenses();

    const result = expenses.filter(
      e => e.createdAt === date
    );

    console.log(result);
  });

// ---------------- RUN ----------------

program.parse();