import nodemailer from "nodemailer";
import { Status, STATUS_CONFIG } from "@/types";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendStatusUpdateEmail({
  to,
  ticketNumber,
  subject,
  requesterName,
  oldStatus,
  newStatus,
}: {
  to: string;
  ticketNumber: string;
  subject: string;
  requesterName: string;
  oldStatus: Status;
  newStatus: Status;
}) {
  const oldLabel = STATUS_CONFIG[oldStatus].label;
  const newLabel = STATUS_CONFIG[newStatus].label;

  const statusColors: Record<Status, string> = {
    Open: "#1D4ED8",
    InProgress: "#7C3AED",
    Resolved: "#16A34A",
    Closed: "#6B7280",
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ticket Status Update</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1E3A8A,#1D4ED8);padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#93C5FD;font-weight:600;letter-spacing:1px;text-transform:uppercase;">HIM IT Support</p>
                    <h1 style="margin:4px 0 0;font-size:22px;color:#ffffff;font-weight:800;">Ticket Status Updated</h1>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 16px;font-size:15px;font-weight:900;color:#ffffff;font-family:monospace;letter-spacing:2px;">${ticketNumber}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;font-size:15px;color:#374151;">Hi <strong>${requesterName}</strong>,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">
                Your IT support ticket has been updated. Here's a summary of the change:
              </p>

              <!-- Ticket subject -->
              <div style="background:#F1F5F9;border-left:4px solid #1D4ED8;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;">
                <p style="margin:0;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Subject</p>
                <p style="margin:6px 0 0;font-size:15px;color:#1E293B;font-weight:600;">${subject}</p>
              </div>

              <!-- Status change -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;text-align:center;">
                    <p style="margin:0 0 14px;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Status Change</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" width="40%">
                          <span style="display:inline-block;background:#F1F5F9;border:1px solid #CBD5E1;border-radius:20px;padding:6px 16px;font-size:13px;font-weight:700;color:#475569;">${oldLabel}</span>
                        </td>
                        <td align="center" width="20%">
                          <span style="font-size:20px;color:#94A3B8;">→</span>
                        </td>
                        <td align="center" width="40%">
                          <span style="display:inline-block;background:${statusColors[newStatus]}20;border:1px solid ${statusColors[newStatus]}40;border-radius:20px;padding:6px 16px;font-size:13px;font-weight:700;color:${statusColors[newStatus]};">${newLabel}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${newStatus === "Resolved" || newStatus === "Closed"
    ? `<div style="background:#DCFCE7;border:1px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin-bottom:28px;text-align:center;">
                    <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">✅ Your issue has been ${newLabel.toLowerCase()}. Thank you for your patience!</p>
                  </div>`
    : ""}

              <p style="margin:0;font-size:13px;color:#94A3B8;text-align:center;">
                If you have further questions, please submit a new ticket or contact the IT team directly.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;">
                This is an automated notification from <strong>HIM IT Support Ticketing System</strong>.<br/>
                Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    console.log(`Attempting to send ticket status email to ${to}...`);
    const info = await transporter.sendMail({
      from: `"HIM IT Support" <${process.env.SMTP_USER}>`,
      to,
      subject: `[${ticketNumber}] Your ticket status has been updated to "${newLabel}"`,
      html,
    });
    console.log(`Ticket email sent successfully! MessageID: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("CRITICAL TICKETING EMAIL FAILURE:");
    console.error(`- To: ${to}`);
    console.error(`- Ticket: ${ticketNumber}`);
    console.error(`- Error Message: ${error.message}`);
    console.error(`- Error Code: ${error.code}`);
    if (error.response) console.error(`- Server Response: ${error.response}`);
    throw error;
  }
}
