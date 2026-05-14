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
      console.error("[PATCH Validation failed]", validation.error.format());
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

    const isResolvedStatus = status === "Resolved" || status === "Closed";
    const wasResolvedStatus = existing.status === "Resolved" || existing.status === "Closed";
    
    // Determine resolvedAt
    let resolvedAt = existing.resolvedAt;
    if (isResolvedStatus && !wasResolvedStatus) {
      resolvedAt = new Date();
    } else if (!isResolvedStatus) {
      resolvedAt = null;
    }

    // Determine what changed for the log
    let logAction = "Ticket Updated";
    let logDetails = "Administration details updated.";
    if (existing.status !== status) {
      logAction = "Status Changed";
      logDetails = `Status changed from ${existing.status} to ${status}.`;
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { 
        status,
        personInCharge: personInCharge !== undefined ? personInCharge : existing.personInCharge,
        adminDescription: adminDescription !== undefined ? adminDescription : existing.adminDescription,
        actionTaken: actionTaken !== undefined ? actionTaken : existing.actionTaken,
        resolvedAt,
        logs: {
          create: {
            action: logAction,
            details: logDetails,
            user: personInCharge || "System",
          }
        }
      },
    });

    // Send email notification if requester provided an email and status actually changed
    console.log(`[Email Trigger Check] Requester: ${existing.requesterEmail}, Old: ${existing.status}, New: ${newStatus}`);
    
    if (existing.requesterEmail && existing.status !== newStatus) {
      try {
        console.log(`[Email Trigger] Attempting to send to ${existing.requesterEmail}...`);
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
        console.log("[Email Trigger] Sent successfully.");
      } catch (err) {
        console.error("[Email notification failed]", err);
      }
    } else {
      console.log("[Email Trigger] Skipped: No email or status didn't change.");
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error("[PATCH /api/tickets/[id]] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update ticket", details: error.message },
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
