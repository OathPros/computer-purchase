import type { PurchaseRequest } from "@/lib/cart";

const REQUEST_DESTINATION = "lukegag2@gmail.com";

export function createRequestEmailPayload(request: PurchaseRequest) {
  return {
    to: REQUEST_DESTINATION,
    subject: `Purchase Request - ${request.requester.fullName}`,
    body: {
      requester: request.requester,
      items: request.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: Number((item.quantity * item.product.price).toFixed(2)),
        selectedUpgrades: item.selectedUpgrades
      }))
    }
  };
}
