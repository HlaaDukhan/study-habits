import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  // Auto-update passed events
  const now = new Date();
  for (const event of events) {
    if (event.status === "upcoming" && event.date < now) {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: "passed" },
      });
      event.status = "passed";
    }
  }

  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.name || !body.date || !body.type) {
    return NextResponse.json(
      { error: "Name, date, and type are required" },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      userId: session.user.id,
      name: body.name,
      type: body.type,
      date: new Date(body.date),
      notes: body.notes || null,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event || event.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
