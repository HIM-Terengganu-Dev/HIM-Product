import QRCode from "qrcode";

export async function generateAssetQR(assetTag: string) {
  // If the ticketing system is running elsewhere, we specify its URL. For local testing, we assume localhost:3001
  const ticketingUrl = process.env.NEXT_PUBLIC_TICKETING_URL || "http://localhost:3001";
  const urlToEncode = `${ticketingUrl}/submit?assetId=${assetTag}`;
  
  try {
    // Generate base64 Data URI
    const qrCodeDataUri = await QRCode.toDataURL(urlToEncode, {
      width: 300,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" }
    });
    return qrCodeDataUri;
  } catch (err) {
    console.error("Failed to generate QR code", err);
    return null;
  }
}
