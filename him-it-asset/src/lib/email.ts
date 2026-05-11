import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// Ensure environment variables are set for email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAssetDeclarationEmail(asset: any) {
  if (!asset.assignedEmail || !process.env.SMTP_USER) {
    console.log("Skipping email: No assigned email or SMTP not configured.");
    return;
  }

  // Get template from DB or use default
  let template = await prisma.emailTemplate.findUnique({
    where: { id: "default" },
  });

  if (!template) {
    template = {
      id: "default",
      subject: "Asset Declaration: {{assetName}}",
      body: `Hello {{userName}},\n\nYou have been assigned a new IT Asset.\n\nAsset Details:\n- Name: {{assetName}}\n- Tag: {{assetTag}}\n- Serial Number: {{serialNumber}}\n- Model: {{model}}\n\nPlease keep this email for your records.\n\nThank you,\nIT Department`,
      updatedAt: new Date()
    };
  }

  // Replace placeholders
  const subject = template.subject
    .replace("{{assetName}}", asset.name)
    .replace("{{assetTag}}", asset.assetTag);

  const bodyContent = template.body
    .replace(/\{\{userName\}\}/g, asset.assignedUser || "User")
    .replace(/\{\{assetName\}\}/g, asset.name)
    .replace(/\{\{assetTag\}\}/g, asset.assetTag)
    .replace(/\{\{serialNumber\}\}/g, asset.serialNumber || "N/A")
    .replace(/\{\{model\}\}/g, asset.model || "N/A")
    .replace(/\n/g, "<br/>");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                    <p style="margin:0;font-size:13px;color:#93C5FD;font-weight:600;letter-spacing:1px;text-transform:uppercase;">HIM IT Infrastructure</p>
                    <h1 style="margin:4px 0 0;font-size:22px;color:#ffffff;font-weight:800;">Asset Declaration</h1>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 16px;font-size:15px;font-weight:900;color:#ffffff;font-family:monospace;letter-spacing:2px;">${asset.assetTag}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <div style="font-size:15px;color:#374151;line-height:1.6;">
                ${bodyContent}
              </div>

              <div style="margin-top:32px;padding-top:32px;border-top:1px solid #F1F5F9;">
                <p style="margin:0 0 16px;font-size:12px;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Hardware Specifications</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;padding:20px;">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Model</p>
                      <p style="margin:2px 0 0;font-size:14px;color:#1E293B;font-weight:600;">${asset.model || 'N/A'}</p>
                    </td>
                    <td style="padding-bottom:12px;">
                      <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Brand</p>
                      <p style="margin:2px 0 0;font-size:14px;color:#1E293B;font-weight:600;">${asset.brand || 'N/A'}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Serial Number</p>
                      <p style="margin:2px 0 0;font-size:14px;color:#1E293B;font-weight:600;font-family:monospace;">${asset.serialNumber || 'N/A'}</p>
                    </td>
                    <td>
                      <p style="margin:0;font-size:11px;color:#94A3B8;font-weight:600;text-transform:uppercase;">Condition</p>
                      <p style="margin:2px 0 0;font-size:14px;color:#1E293B;font-weight:600;">${asset.condition || 'Good'}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;">
                This is an automated notification from <strong>HIM IT Asset Management System</strong>.<br/>
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
    console.log(`Attempting to send HTML email to ${asset.assignedEmail}...`);
    const info = await transporter.sendMail({
      from: `"HIM IT Infrastructure" <${process.env.SMTP_USER}>`,
      to: asset.assignedEmail,
      subject: subject,
      html: html,
    });
    console.log(`Email sent successfully! MessageID: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("CRITICAL EMAIL FAILURE:");
    console.error(`- To: ${asset.assignedEmail}`);
    console.error(`- Error Message: ${error.message}`);
    console.error(`- Error Code: ${error.code}`);
    if (error.response) console.error(`- Server Response: ${error.response}`);
    throw error;
  }
}
