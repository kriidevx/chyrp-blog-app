import { QRCode } from "react-qrcode-logo";
export default function QRCodeDisplay({ value }: { value: string }) {
  return <QRCode value={value} />;
}
