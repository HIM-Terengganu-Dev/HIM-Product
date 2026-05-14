import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateStatusSchema } from "@/lib/validations";
import { Status } from "@prisma/client";
import { sendStatusUpdateEmail } from "@/lib/email";

// GET /api/tickets/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("[GET /api/tickets/[id]]", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

// PATCH /api/tickets/[id] — update status and trigger email if email on record
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validation.error.issues },
        { status: 400 }
      );
    }

    const { status: newStatus, personInCharge, adminDescription, actionTaken } = validation.data;
    const status = newStatus as Status;

    // Fetch current ticket first (to get old status + email)
    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { 
        status,
        personInCharge: personInCharge || existing.personInCharge,
        adminDescription: adminDescription || existing.adminDescription,
        actionTaken: actionTaken || existing.actionTaken,
      },
    });

    // Send email notification if requester provided an email and status actually changed
    if (existing.requesterEmail && existing.status !== newStatus) {
      try {
        await sendStatusUpdateEmail({
          to: existing.requesterEmail,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          requesterName: ticket.requesterName,
          oldStatus: existing.status,
          newStatus,
          personInCharge: ticket.personInCharge,
          adminDescription: ticket.adminDescription,
          actionTaken: ticket.actionTaken,
        });
      } catch (err) {
        console.error("[Email notification failed]", err);
      }
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("[PATCH /api/tickets/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.ticket.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/tickets/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
