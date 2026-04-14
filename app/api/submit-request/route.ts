import { NextResponse } from "next/server";
import { getProductById } from "@/lib/catalog";
import { createRequestEmailPayload } from "@/lib/email";
import type { CartItem, RequesterDetails } from "@/lib/cart";

type SubmitRequestBody = {
  requester: RequesterDetails;
  items: CartItem[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitRequestBody;

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

  const payload = createRequestEmailPayload({
    requester: body.requester,
    items
  });

  return NextResponse.json({
    message: "Request payload prepared. Email sending is not enabled yet.",
    payload
  });
}
