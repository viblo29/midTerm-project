import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "expenses.json");

function read() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET all + filters + sort + pagination
export async function GET(req) {
  let data = read();

  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);

  // filter
  if (category) {
    data = data.filter(e => e.category === category);
  }

  // sort
  if (sort === "asc") {
    data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  if (sort === "desc") {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // pagination
  const start = (page - 1) * limit;
  const end = start + limit;

  return Response.json(data.slice(start, end));
}

// CREATE
export async function POST(req) {
  const body = await req.json();

  if (!body.category || !body.price) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  if (Number(body.price) < 10) {
    return Response.json({ error: "Price must be >= 10" }, { status: 400 });
  }

  const data = read();

  const newExpense = {
    id: Date.now(),
    category: body.category,
    price: Number(body.price),
    createdAt: new Date().toISOString().split("T")[0]
  };

  data.push(newExpense);
  write(data);

  return Response.json(newExpense);
}