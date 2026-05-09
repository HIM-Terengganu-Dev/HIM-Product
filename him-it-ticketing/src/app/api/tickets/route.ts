import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ticketSchema } from "@/lib/validations";
import { Prisma, Category, Priority, Status } from "@prisma/client";

// GET /api/tickets — list all tickets with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const where: Prisma.TicketWhereInput = {};

    if (status && status !== "all") {
      where.status = status as Status;
    }
    if (priority && priority !== "all") {
      where.priority = priority as Priority;
    }
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: "insensitive" } },
        { requesterName: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("[GET /api/tickets]", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST /api/tickets — create a new ticket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ticketSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { requesterName, requesterEmail, department, category, priority, subject, description } =
      validation.data;

    // Generate ticket number based on total count
    const count = await prisma.ticket.count();
    const ticketNumber = `TKT-${String(count + 1).padStart(4, "0")}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        requesterName,
        requesterEmail: requesterEmail || null,
        department,
        category: category as Category,
        priority: priority as Priority,
        subject,
        description,
        status: "Open",
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tickets]", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
