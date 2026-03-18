import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Review from "@/models/Review";

export async function GET() {
  await connectMongo();
  const reviews = await Review.find().sort({ _id: -1 }); 
  return NextResponse.json(reviews);
}

export async function POST(req) {
  await connectMongo();
  const { name, city, content } = await req.json();

  if (!name || !city || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const review = await Review.create({ name, city, content, likes: 0 });
  return NextResponse.json(review);
}

export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await Review.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(req) {
  await connectMongo();
  const { id, delta } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const review = await Review.findById(id);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  review.likes += delta;
  await review.save();

  return NextResponse.json(review);
}