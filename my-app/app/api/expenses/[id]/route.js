import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "expenses.json");

function read() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET BY ID
export async function GET(_, { params }) {
  const data = read();

  const item = data.find(e => e.id === Number(params.id));

  return Response.json(item || { error: "Not found" });
}

// UPDATE
export async function PUT(req, { params }) {
  const body = await req.json();
  const data = read();

  const item = data.find(e => e.id === Number(params.id));

  if (!item) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (body.category) item.category = body.category;

  if (body.price) {
    if (Number(body.price) < 10) {
      return Response.json({ error: "Price must be >= 10" }, { status: 400 });
    }
    item.price = Number(body.price);
  }

  write(data);

  return Response.json(item);
}

// DELETE
export async function DELETE(_, { params }) {
  let data = read();

  const deleted = data.find(e => e.id === Number(params.id));

  data = data.filter(e => e.id !== Number(params.id));

  write(data);

  return Response.json(deleted);
}