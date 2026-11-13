import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SHOPEE_ENDPOINT = "https://open-api.affiliate.shopee.com.br/graphql";

type ShopeeProduct = {
  itemId?: string | number;
  productName?: string;
  productLink?: string;
  offerLink?: string;
  imageUrl?: string;
  priceMin?: string | number;
  priceMax?: string | number;
  priceDiscountRate?: string | number;
  sales?: string | number;
  ratingStar?: string | number;
  shopName?: string;
  shopType?: number;
};

function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = (searchParams.get("q") || "").trim().slice(0, 100);

  if (keyword.length < 2) {
    return NextResponse.json(
      { status: "error", message: "Digite pelo menos 2 caracteres para pesquisar." },
      { status: 400 }
    );
  }

  const appId = process.env.SHOPEE_APP_ID?.trim();
  const secret = process.env.SHOPEE_SECRET?.trim();

  if (!appId || !secret) {
    return NextResponse.json(
      { status: "error", message: "As credenciais da Shopee não foram encontradas no servidor. Confira as variáveis de ambiente do projeto." },
      { status: 503 }
    );
  }

  // O corpo assinado é exatamente o mesmo texto enviado à Shopee.
  const body = JSON.stringify({
    query: `query SearchProducts($keyword: String, $page: Int, $limit: Int) {
      productOfferV2(keyword: $keyword, listType: 0, sortType: 1, page: $page, limit: $limit) {
        nodes {
          itemId
          productName
          productLink
          offerLink
          imageUrl
          priceMin
          priceMax
          priceDiscountRate
          sales
          ratingStar
          shopName
          shopType
        }
        pageInfo {
          page
          limit
          hasNextPage
        }
      }
    }`,
    variables: { keyword, page: 1, limit: 20 }
  });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha256")
    .update(appId + timestamp + body + secret, "utf8")
    .digest("hex");

  try {
    const response = await fetch(SHOPEE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(20000)
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: "A Shopee não conseguiu concluir a consulta agora. Tente novamente mais tarde." },
        { status: 502 }
      );
    }

    if (Array.isArray(result.errors) && result.errors.length > 0) {
      const codes = result.errors
        .map((error: { extensions?: { code?: number } }) => error.extensions?.code)
        .filter((code: unknown) => typeof code === "number");
      const code = codes[0];

      const messages: Record<number, string> = {
        10020: "A Shopee recusou a autenticação. Confira se o App ID e o Secret atuais foram cadastrados corretamente.",
        10030: "A Shopee limitou temporariamente as consultas. Aguarde um pouco e tente novamente.",
        10035: "A conta ainda não tem permissão de consulta à Open API da Shopee.",
        11001: "A Shopee recusou os parâmetros da pesquisa."
      };

      return NextResponse.json(
        {
          status: "error",
          message: (typeof code === "number" && messages[code]) ||
            "A Shopee retornou um erro na consulta. Tente novamente em instantes."
        },
        { status: 502 }
      );
    }

    const nodes = result?.data?.productOfferV2?.nodes;
    if (!Array.isArray(nodes)) {
      return NextResponse.json(
        { status: "error", message: "A resposta da Shopee veio em um formato inesperado." },
        { status: 502 }
      );
    }

    const products = (nodes as ShopeeProduct[]).map((item, index) => ({
      id: String(item.itemId ?? index),
      name: item.productName || "Produto sem nome",
      url: item.offerLink || item.productLink || "",
      imageUrl: item.imageUrl || "",
      priceMin: safeNumber(item.priceMin),
      priceMax: safeNumber(item.priceMax),
      discount: safeNumber(item.priceDiscountRate),
      sales: safeNumber(item.sales),
      rating: safeNumber(item.ratingStar),
      shopName: item.shopName || "Shopee"
    })).filter((item) => item.url);

    return NextResponse.json({
      status: "success",
      source: "Shopee",
      query: keyword,
      products,
      hasNextPage: Boolean(result?.data?.productOfferV2?.pageInfo?.hasNextPage)
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Não foi possível conectar à Shopee. Verifique a conexão e tente novamente." },
      { status: 502 }
    );
  }
}
