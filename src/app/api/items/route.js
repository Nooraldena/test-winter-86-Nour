import { connectMongo } from "@/lib/mongoose";
import Item from "@/models/Item";
import { NextResponse } from "next/server";

// GET – קריאה
export async function GET() {
  await connectMongo();
  const items = await Item.find();
  return NextResponse.json(items);
}

// POST – הוספה
export async function POST(req) {
  await connectMongo();

  const { title, content, username, count, Like } = await req.json();

  // בדיקה בסיסית (אופציונלי)
  if (!title || !content || !username) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const item = await Item.create({
    title,
    content,
    username,
    count: count || 0,
    Like: Like || 0,
  });

  return NextResponse.json(item);
}

// PUT – עריכה
export async function PUT(req) {
  await connectMongo();

  const { id, title, content, username, count, Like } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      title,
      content,
      username,
      count: count || 0,
      Like: Like || 0,
    },
    { new: true }
  );

  return NextResponse.json(updatedItem);
}

// DELETE – מחיקה
export async function DELETE(req) {
  await connectMongo();

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
  }

  await Item.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
