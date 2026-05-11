"use server";

import { prisma } from "@/lib/prisma";
import { generateAssetQR } from "@/lib/qr";
import { revalidatePath } from "next/cache";
import { sendAssetDeclarationEmail } from "@/lib/email";

export async function getAssets() {
  return await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createAsset(formData: FormData) {
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const specs = formData.get("specs") as string;
  const notes = formData.get("notes") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const condition = formData.get("condition") as string;
  const warranty = formData.get("warranty") as string;
  const category = formData.get("category") as any;
  const department = formData.get("department") as string;
  const assignedUser = formData.get("assignedUser") as string;
  const assignedEmail = formData.get("assignedEmail") as string;
  const purchaseDate = formData.get("purchaseDate") ? new Date(formData.get("purchaseDate") as string) : null;
  const invoiceNumber = formData.get("invoiceNumber") as string;
  const warrantyEnd = formData.get("warrantyEnd") ? new Date(formData.get("warrantyEnd") as string) : null;
  
  // Generate a unique Asset Tag: AST-{count}
  const count = await prisma.asset.count();
  const assetTag = `AST-${String(count + 1).padStart(4, "0")}`;
  
  // Generate QR Code URL
  const qrCodeUrl = await generateAssetQR(assetTag);

  await prisma.asset.create({
    data: {
      assetTag,
      name,
      brand,
      model,
      specs,
      notes,
      serialNumber,
      condition,
      warranty,
      warrantyEnd,
      category,
      department,
      assignedUser: assignedUser || null,
      assignedEmail: assignedEmail || null,
      purchaseDate,
      invoiceNumber,
      status: (assignedUser || assignedEmail) ? "Assigned" : "Available",
      qrCodeUrl,
      logs: {
        create: {
          action: "Asset Created",
          details: `Initial registration of ${name}.`,
          user: "Admin",
        }
      }
    },
  });

  if (assignedEmail) {
    const createdAsset = await prisma.asset.findFirst({
      where: { assetTag },
    });
    if (createdAsset) {
      await sendAssetDeclarationEmail(createdAsset);
    }
  }

  revalidatePath("/");
}

export async function updateAsset(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const specs = formData.get("specs") as string;
  const notes = formData.get("notes") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const condition = formData.get("condition") as string;
  const warranty = formData.get("warranty") as string;
  const category = formData.get("category") as any;
  const department = formData.get("department") as string;
  const assignedUser = formData.get("assignedUser") as string;
  const assignedEmail = formData.get("assignedEmail") as string;
  const status = formData.get("status") as any;
  const purchaseDate = formData.get("purchaseDate") ? new Date(formData.get("purchaseDate") as string) : null;
  const invoiceNumber = formData.get("invoiceNumber") as string;
  const warrantyEnd = formData.get("warrantyEnd") ? new Date(formData.get("warrantyEnd") as string) : null;

  const oldAsset = await prisma.asset.findUnique({ where: { id } });

  const updatedAsset = await prisma.asset.update({
    where: { id },
    data: {
      name,
      brand,
      model,
      specs,
      notes,
      serialNumber,
      condition,
      warranty,
      warrantyEnd,
      category,
      department,
      assignedUser: assignedUser || null,
      assignedEmail: assignedEmail || null,
      status: (status === "Available" && (assignedUser || assignedEmail)) ? "Assigned" : status,
      purchaseDate,
      invoiceNumber,
      logs: {
        create: {
          action: "Asset Details Updated",
          details: `Manual update of asset information and technical specs.`,
          user: "Admin",
        }
      }
    },
  });

  if (assignedEmail && oldAsset?.assignedEmail !== assignedEmail) {
    await sendAssetDeclarationEmail(updatedAsset);
  }

  revalidatePath(`/asset/${id}`);
  revalidatePath("/");
}

export async function deleteAsset(id: string) {
  // To avoid relation errors, first delete associated records
  await prisma.assetIssue.deleteMany({ where: { assetId: id } });
  await prisma.assetLog.deleteMany({ where: { assetId: id } });
  
  await prisma.asset.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function updateAssetStatus(id: string, newStatus: any) {
  await prisma.asset.update({
    where: { id },
    data: { 
      status: newStatus,
      logs: {
        create: {
          action: "Status Changed",
          details: `Asset status changed to ${newStatus}.`,
          user: "Admin",
        }
      }
    },
  });
  revalidatePath(`/asset/${id}`);
  revalidatePath("/");
}

// Category Management Actions
export async function getAssetCategories() {
  const categories = await prisma.assetCategory.findMany({
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) {
    const defaults = [
      'Laptop', 'Desktop', 'Monitor', 'Network Equipment', 
      'Accessory', 'Printer', 'Mobile Phone', 'Tablet', 'Other'
    ];
    for (const name of defaults) {
      await prisma.assetCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    return await prisma.assetCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  return categories;
}

export async function addAssetCategory(name: string) {
  if (!name || name.trim() === "") return;
  await prisma.assetCategory.upsert({
    where: { name: name.trim() },
    update: {},
    create: { name: name.trim() },
  });
  revalidatePath("/");
}

export async function deleteAssetCategory(id: string) {
  await prisma.assetCategory.delete({
    where: { id },
  });
  revalidatePath("/");
}

// Email Template Actions
export async function getEmailTemplate() {
  let template = await prisma.emailTemplate.findUnique({
    where: { id: "default" },
  });

  if (!template) {
    template = await prisma.emailTemplate.create({
      data: {
        id: "default",
        subject: "Asset Declaration: {{assetName}}",
        body: `Hello {{userName}},\n\nYou have been assigned a new IT Asset.\n\nAsset Details:\n- Name: {{assetName}}\n- Tag: {{assetTag}}\n- Serial Number: {{serialNumber}}\n- Model: {{model}}\n\nPlease keep this email for your records.\n\nThank you,\nIT Department`,
      }
    });
  }

  return template;
}

export async function updateEmailTemplate(formData: FormData) {
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  await prisma.emailTemplate.upsert({
    where: { id: "default" },
    update: { subject, body },
    create: { id: "default", subject, body },
  });

  revalidatePath("/");
}
