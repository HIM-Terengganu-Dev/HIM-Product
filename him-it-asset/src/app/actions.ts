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
  const category = formData.get("category") as any;
  const department = formData.get("department") as string;
  const assignedUser = formData.get("assignedUser") as string;
  
  // Generate a unique Asset Tag: AST-{count}
  const count = await prisma.asset.count();
  const assetTag = `AST-${String(count + 1).padStart(4, "0")}`;
  
  // Generate QR Code URL
  const qrCodeUrl = await generateAssetQR(assetTag);

  await prisma.asset.create({
    data: {
      assetTag,
      name,
      category,
      department,
      assignedUser: assignedUser || null,
      purchaseDate: new Date(),
      status: "Available",
      qrCodeUrl,
    },
  });

  revalidatePath("/");
}

export async function deleteAsset(id: string) {
  await prisma.asset.delete({
    where: { id },
  });
  revalidatePath("/");
}
