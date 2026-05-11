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

  const body = template.body
    .replace(/\{\{userName\}\}/g, asset.assignedUser || "User")
    .replace(/\{\{assetName\}\}/g, asset.name)
    .replace(/\{\{assetTag\}\}/g, asset.assetTag)
    .replace(/\{\{serialNumber\}\}/g, asset.serialNumber || "N/A")
    .replace(/\{\{model\}\}/g, asset.model || "N/A");

  try {
    await transporter.sendMail({
      from: `"IT Asset Management" <${process.env.SMTP_USER}>`,
      to: asset.assignedEmail,
      subject: subject,
      text: body,
    });
    console.log(`Email sent successfully to ${asset.assignedEmail}`);
  } catch (error) {
    console.error("Failed to send asset declaration email:", error);
  }
}
