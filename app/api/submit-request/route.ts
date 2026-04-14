import { NextResponse } from "next/server";
import { getProductById } from "@/lib/catalog";
import { createRequestEmailPayload } from "@/lib/email";
import type { CartItem, RequesterDetails } from "@/lib/cart";

type SubmitRequestBody = {
  requester?: Partial<RequesterDetails>;
  items?: unknown;
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

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<CartItem>;
      return typeof candidate.productId === "string" && typeof candidate.quantity === "number";
    })
    .map((item) => ({
      productId: item.productId.trim(),
      quantity: Math.max(1, Math.floor(item.quantity)),
      selectedUpgrades: Array.isArray(item.selectedUpgrades)
        ? item.selectedUpgrades.filter((upgrade): upgrade is string => typeof upgrade === "string").slice(0, 20)
        : []
    }))
    .filter((item) => item.productId.length > 0);
}

export async function POST(request: Request) {
  let body: SubmitRequestBody;

  try {
    body = (await request.json()) as SubmitRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const requester = (body.requester ?? {}) as Partial<RequesterDetails>;
  const missingField = REQUIRED_REQUESTER_FIELDS.find((field) => !String(requester[field] ?? "").trim());
  if (missingField) {
    return NextResponse.json({ message: `Missing required field: ${missingField}` }, { status: 400 });
  }

  if (!isValidEmail(String(requester.email))) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  const items = parseItems(body.items)
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) {
        return null;
      }

      const allowedUpgrades = new Set(product.optionalUpgrades);
      return {
        ...item,
        selectedUpgrades: item.selectedUpgrades.filter((upgrade) => allowedUpgrades.has(upgrade)),
        product
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (!items.length) {
    return NextResponse.json({ message: "At least one valid requested item is required." }, { status: 400 });
  }

  const normalizedRequester: RequesterDetails = {
    fullName: String(requester.fullName).trim(),
    email: String(requester.email).trim(),
    department: String(requester.department).trim(),
    phoneNumber: String(requester.phoneNumber).trim(),
    approverName: String(requester.approverName).trim(),
    budgetCostCentre: String(requester.budgetCostCentre).trim(),
    deliveryLocation: String(requester.deliveryLocation).trim(),
    urgency: String(requester.urgency).trim(),
    businessJustification: String(requester.businessJustification).trim(),
    notes: String(requester.notes ?? "").trim() || undefined
  };

  const payload = createRequestEmailPayload({
    requester: normalizedRequester,
    items
  });

  return NextResponse.json({
    message: "Request captured successfully. No email has been sent.",
    summary: {
      requester: normalizedRequester,
      items: payload.body.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        selectedUpgrades: item.productOptions
      })),
      estimatedTotal: payload.body.estimatedTotal
    }
  });
}
