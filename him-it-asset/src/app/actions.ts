"use server";

import { prisma } from "@/lib/prisma";
import { generateAssetQR } from "@/lib/qr";
import { revalidatePath } from "next/cache";

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
  const purchaseDate = formData.get("purchaseDate") ? new Date(formData.get("purchaseDate") as string) : null;
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
      purchaseDate,
      status: "Available",
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
  const status = formData.get("status") as any;
  const purchaseDate = formData.get("purchaseDate") ? new Date(formData.get("purchaseDate") as string) : null;
  const warrantyEnd = formData.get("warrantyEnd") ? new Date(formData.get("warrantyEnd") as string) : null;

  await prisma.asset.update({
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
      status,
      purchaseDate,
      logs: {
        create: {
          action: "Asset Details Updated",
          details: `Manual update of asset information and technical specs.`,
          user: "Admin",
        }
      }
    },
  });

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
