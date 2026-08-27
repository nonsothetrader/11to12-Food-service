import { jsPDF } from 'jspdf';

export interface InvoicePDFData {
  ticketNumber: string;
  subscriberName: string;
  email: string;
  phone: string;
  address: string;
  selectedDates: string[];
  totalDays: number;
  pricePerMeal: number;
  grandTotal: number;
  issueDate?: string;
}

export function downloadInvoicePDF(data: InvoicePDFData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const formatNaira = (amt: number) => `NGN ${amt.toLocaleString('en-NG')}`;

  // Palette
  const darkNavy = [17, 24, 39] as const; // #111827
  const amberAccent = [217, 119, 6] as const; // #D97706
  const stoneMuted = [107, 114, 128] as const;
  const lightBg = [250, 249, 246] as const;

  // 1. Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Brand Logo / Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('11to12', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(217, 119, 6);
  doc.text('HOT CORPORATE DESK LUNCHES • LAGOS', 15, 27);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text('11:00 AM – 12:00 PM Guaranteed Desk Drops (Mon – Fri)', 15, 34);

  // Invoice Title on Right
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('OFFICIAL INVOICE', 195, 18, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(217, 119, 6);
  doc.text(`PASS / REF: ${data.ticketNumber}`, 195, 25, { align: 'right' });

  const dateIssuedStr = data.issueDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text(`Issued: ${dateIssuedStr} | Dispatch Launch: Oct 12, 2026`, 195, 32, { align: 'right' });

  // 2. Client & Account Summary Box
  let y = 50;

  // Client Details Box (Left)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(15, y, 88, 38, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(15, y, 88, 38, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('BILLED TO (SUBSCRIBER)', 20, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(data.subscriberName || 'Valued Subscriber', 20, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(stoneMuted[0], stoneMuted[1], stoneMuted[2]);
  doc.text(`Email: ${data.email || 'N/A'}`, 20, y + 20);
  doc.text(`Phone: ${data.phone || 'N/A'}`, 20, y + 26);
  
  // Wrap address if needed
  const addressLines = doc.splitTextToSize(`Desk Address: ${data.address || 'Office Desk'}`, 78);
  doc.text(addressLines, 20, y + 32);

  // Bank Transfer Details Box (Right)
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(107, y, 88, 38, 3, 3, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(107, y, 88, 38, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text('BANK TRANSFER DETAILS', 112, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Bank Name: Moniepoint MFB / Providus Bank', 112, y + 14);
  doc.text('Account Name: 11to12 Foods Limited', 112, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(amberAccent[0], amberAccent[1], amberAccent[2]);
  doc.text('Account Number: 8031234567', 112, y + 27);

  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`Amount to Transfer: ${formatNaira(data.grandTotal)}`, 112, y + 34);

  // 3. Line Items Table
  y = 96;

  // Table Header
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(15, y, 180, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ITEM DESCRIPTION', 20, y + 5.5);
  doc.text('WORKDAYS', 120, y + 5.5, { align: 'center' });
  doc.text('RATE', 150, y + 5.5, { align: 'center' });
  doc.text('SUBTOTAL', 190, y + 5.5, { align: 'right' });

  y += 8;

  // Table Row 1: Meals
  doc.setFillColor(255, 255, 255);
  doc.rect(15, y, 180, 12, 'F');
  doc.setDrawColor(240, 240, 240);
  doc.line(15, y + 12, 195, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Corporate Gourmet Lunch Subscription', 20, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(stoneMuted[0], stoneMuted[1], stoneMuted[2]);
  doc.text('Hot authentic Nigerian meals delivered daily to your desk (11 AM – 12 PM)', 20, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`${data.totalDays} Days`, 120, y + 7, { align: 'center' });
  doc.text(formatNaira(data.pricePerMeal), 150, y + 7, { align: 'center' });
  doc.text(formatNaira(data.grandTotal), 190, y + 7, { align: 'right' });

  y += 12;

  // Table Row 2: Free Desk Delivery
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(15, y, 180, 10, 'F');
  doc.setDrawColor(240, 240, 240);
  doc.line(15, y + 10, 195, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Guaranteed Lagos Office Desk Dispatch & Eco Packaging', 20, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('INCLUDED (FREE)', 190, y + 6, { align: 'right' });

  y += 10;

  // Total Summary Row
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(120, y + 4, 75, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL AMOUNT DUE:', 125, y + 11.5);
  doc.setTextColor(217, 119, 6);
  doc.setFontSize(11);
  doc.text(formatNaira(data.grandTotal), 190, y + 11.5, { align: 'right' });

  y += 24;

  // 4. Selected Workdays Schedule Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`SELECTED DELIVERY WORKDAYS (${data.totalDays} DAYS)`, 15, y);

  y += 4;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(15, y, 180, 32, 2, 2, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(15, y, 180, 32, 2, 2, 'S');

  // Format list of dates
  const formattedDates = data.selectedDates.map(dStr => {
    const d = new Date(dStr);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  });

  const datesText = formattedDates.join('  •  ');
  const splitSchedule = doc.splitTextToSize(datesText, 170);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(splitSchedule, 20, y + 7);

  doc.setFontSize(7.5);
  doc.setTextColor(stoneMuted[0], stoneMuted[1], stoneMuted[2]);
  doc.text('* Flexible skip & credit rollovers are supported for all locked dates before 12:00 PM daily.', 20, y + 27);

  y += 40;

  // 5. Official Proof of Payment & Customer Care Notice
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(15, y, 180, 44, 3, 3, 'F');
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(15, y, 180, 44, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('SEND PROOF OF PAYMENT TO OFFICIAL CHANNELS:', 20, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(37, 211, 102); // WhatsApp green
  doc.text('• Send via WhatsApp: 11to12 Official (0803 123 4567)', 20, y + 16);

  doc.setTextColor(59, 130, 246); // Blue
  doc.text('• Send via Official Mail: payment@11to12.com', 20, y + 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(
    'After sending your proof of payment or bank receipt, our customer care desk will verify your payment, confirm your desk delivery schedule, and take care of your complete onboarding until delivery dispatch starts on Monday, October 12, 2026.',
    20,
    y + 30,
    { maxWidth: 170 }
  );

  // Footer Note
  doc.setFontSize(7.5);
  doc.setTextColor(stoneMuted[0], stoneMuted[1], stoneMuted[2]);
  doc.text('11to12 Foods Limited • Lagos Corporate Headquarters • Thank you for choosing 11to12!', 105, 287, { align: 'center' });

  // Save the PDF
  const filename = `11to12-Invoice-${data.ticketNumber || 'PASS'}.pdf`;
  doc.save(filename);
}
