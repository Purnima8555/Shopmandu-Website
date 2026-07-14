import QRCode from "qrcode";

export const QR = async (text) => {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        throw new Error("QR generation failed");
    }
};
