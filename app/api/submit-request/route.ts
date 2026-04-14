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
    return NextResponse.json({ message: "At least one requested item is required." }, { status: 400 });
  }

  const payload = createRequestEmailPayload({
    requester: body.requester,
    items
  });

  return NextResponse.json({
    message: "Email payload generated successfully. No email has been sent.",
    emailPayload: payload
  });
}
