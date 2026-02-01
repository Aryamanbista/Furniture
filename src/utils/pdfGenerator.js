import { jsPDF } from "jspdf";

export const generateReceipt = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text("FurniHome", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Premium Furniture Store", 20, 32);

  // Receipt title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Order Receipt", pageWidth - 20, 25, { align: "right" });

  // Order info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Order #: ${order.id}`, pageWidth - 20, 35, { align: "right" });
  doc.text(`Date: ${formatDate(order.date)}`, pageWidth - 20, 42, {
    align: "right",
  });

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, pageWidth - 20, 50);

  // Shipping info (if available)
  let yPos = 60;
  if (order.shippingInfo) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Shipping Address:", 20, yPos);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    yPos += 8;
    doc.text(
      `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
      20,
      yPos,
    );
    yPos += 6;
    doc.text(order.shippingInfo.address, 20, yPos);
    yPos += 6;
    doc.text(
      `${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`,
      20,
      yPos,
    );
    yPos += 6;
    doc.text(order.shippingInfo.phone, 20, yPos);
    yPos += 15;
  }

  // Items header
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Order Items", 20, yPos);
  yPos += 10;

  // Items table header
  doc.setFillColor(248, 250, 252);
  doc.rect(20, yPos - 5, pageWidth - 40, 10, "F");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Item", 25, yPos);
  doc.text("Qty", 120, yPos);
  doc.text("Price", pageWidth - 25, yPos, { align: "right" });
  yPos += 12;

  // Items
  order.items.forEach((item) => {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(item.name, 25, yPos);

    if (item.color) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Color: ${item.color}`, 25, yPos + 5);
    }

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(String(item.quantity), 125, yPos);
    doc.text(`NPR ${item.price.toLocaleString()}`, pageWidth - 25, yPos, {
      align: "right",
    });

    yPos += item.color ? 15 : 10;
  });

  // Divider
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;

  // Add totals
  yPos += 15; // Add spacing after the table/divider

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 500;
  const tax = subtotal * 0.13;
  const total = subtotal + shipping + tax;

  doc.setFontSize(10);
  doc.text(`Subtotal:`, 140, yPos);
  doc.text(`NPR ${subtotal.toLocaleString()}`, pageWidth - 25, yPos, {
    align: "right",
  });

  yPos += 7;
  doc.text(`Shipping:`, 140, yPos);
  doc.text(`NPR ${shipping.toLocaleString()}`, pageWidth - 25, yPos, {
    align: "right",
  });

  yPos += 7;
  doc.text(`Tax (13%):`, 140, yPos);
  doc.text(`NPR ${tax.toLocaleString()}`, pageWidth - 25, yPos, {
    align: "right",
  });

  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total:`, 140, yPos);
  doc.text(`NPR ${total.toLocaleString()}`, pageWidth - 25, yPos, {
    align: "right",
  });

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for shopping with FurniHome!", pageWidth / 2, yPos, {
    align: "center",
  });
  doc.text(
    "Questions? Contact us at support@furnihome.com",
    pageWidth / 2,
    yPos + 6,
    { align: "center" },
  );
  doc.text("© 2026 FurniHome. All rights reserved.", pageWidth / 2, yPos + 12, {
    align: "center",
  });

  // Save the PDF
  doc.save(`FurniHome-Receipt-${order.id}.pdf`);
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
