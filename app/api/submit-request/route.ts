import { NextResponse } from "next/server";
import { getProductById } from "@/lib/catalog";
import { createRequestEmailPayload } from "@/lib/email";
import type { CartItem, RequesterDetails } from "@/lib/cart";

type SubmitRequestBody = {
  requester: RequesterDetails;
  items: CartItem[];
};

const REQUIRED_REQUESTER_FIELDS: Array<keyof RequesterDetails> = [
  "fullName",
  "email",
  "department",
  "phoneNumber",
  "approverName",
  "budgetCostCentre",
  "deliveryLocation",
  "urgency",
  "businessJustification"
];

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitRequestBody;

  const missingField = REQUIRED_REQUESTER_FIELDS.find((field) => !String(body.requester?.[field] ?? "").trim());
  if (missingField) {
    return NextResponse.json({ message: `Missing required field: ${missingField}` }, { status: 400 });
  }

  const items = body.items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) {
        return null;
      }

      return {
        ...item,
        product
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (!items.length) {
    return NextResponse.json({ message: "At least one cart item is required." }, { status: 400 });
  }

  const payload = createRequestEmailPayload({
    requester: body.requester,
    items
  });

  const estimatedTotal = payload.body.items.reduce((total, item) => total + item.lineTotal, 0);

  return NextResponse.json({
    message: "Purchase request submitted successfully.",
    summary: {
      requester: payload.body.requester,
      items: payload.body.items,
      estimatedTotal: Number(estimatedTotal.toFixed(2))
    }
  });
}
