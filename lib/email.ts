import type { PurchaseRequest } from "@/lib/cart";

const REQUEST_DESTINATION = "lukegag2@yorku.ca";

export function createRequestEmailPayload(request: PurchaseRequest) {
  const items = request.items.map((item) => {
    const unitPrice = Number(item.product.price.toFixed(2));
    const lineTotal = Number((item.quantity * unitPrice).toFixed(2));

    return {
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      productOptions: item.selectedUpgrades
    };
  });

  const estimatedTotal = Number(items.reduce((total, item) => total + item.lineTotal, 0).toFixed(2));
  const requester = request.requester;
  const additionalNotes = requester.notes?.trim() || "None provided";

  const plainTextBody = [
    "Computer Purchase Request",
    "",
    "Requester Information",
    `- Name: ${requester.fullName}`,
    `- Department/Faculty: ${requester.department}`,
    `- Approver: ${requester.approverName}`,
    "",
    "Contact Details",
    `- Email: ${requester.email}`,
    `- Phone: ${requester.phoneNumber}`,
    `- Delivery Location: ${requester.deliveryLocation}`,
    "",
    "Request Details",
    `- Budget Cost Centre: ${requester.budgetCostCentre}`,
    `- Urgency: ${requester.urgency}`,
    "",
    "Cart Items",
    ...items.map((item, index) => {
      const options = item.productOptions.length ? item.productOptions.join(", ") : "None";
      return [
        `${index + 1}. ${item.name}`,
        `   - Product Options: ${options}`,
        `   - Quantity: ${item.quantity}`,
        `   - Individual Price: $${item.unitPrice.toFixed(2)}`,
        `   - Line Total: $${item.lineTotal.toFixed(2)}`
      ].join("\n");
    }),
    "",
    `Estimated Total: $${estimatedTotal.toFixed(2)}`,
    "",
    "Business Justification",
    requester.businessJustification,
    "",
    "Additional Notes",
    additionalNotes
  ].join("\n");

  const htmlBody = `
    <h1>Computer Purchase Request</h1>
    <h2>Requester Information</h2>
    <ul>
      <li><strong>Name:</strong> ${requester.fullName}</li>
      <li><strong>Department/Faculty:</strong> ${requester.department}</li>
      <li><strong>Approver:</strong> ${requester.approverName}</li>
    </ul>
    <h2>Contact Details</h2>
    <ul>
      <li><strong>Email:</strong> ${requester.email}</li>
      <li><strong>Phone:</strong> ${requester.phoneNumber}</li>
      <li><strong>Delivery Location:</strong> ${requester.deliveryLocation}</li>
    </ul>
    <h2>Request Details</h2>
    <ul>
      <li><strong>Budget Cost Centre:</strong> ${requester.budgetCostCentre}</li>
      <li><strong>Urgency:</strong> ${requester.urgency}</li>
    </ul>
    <h2>Cart Items</h2>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Item</th>
          <th>Product Options</th>
          <th>Quantity</th>
          <th>Individual Price</th>
          <th>Line Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.productOptions.length ? item.productOptions.join(", ") : "None"}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${item.lineTotal.toFixed(2)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
    <p><strong>Estimated Total:</strong> $${estimatedTotal.toFixed(2)}</p>
    <h2>Business Justification</h2>
    <p>${requester.businessJustification}</p>
    <h2>Additional Notes</h2>
    <p>${additionalNotes}</p>
  `.trim();

  return {
    to: REQUEST_DESTINATION,
    subject: `Computer Purchase Request - ${requester.fullName} - ${requester.department}`,
    plainTextBody,
    htmlBody,
    body: {
      requester,
      items,
      estimatedTotal,
      businessJustification: requester.businessJustification,
      additionalNotes
    }
  };
}
