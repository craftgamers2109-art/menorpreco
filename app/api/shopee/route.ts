import { NextResponse } from "next/server";

// Esta rota mantém a busca no servidor. As credenciais nunca devem ir para o navegador.
// A chamada real à Shopee será implementada quando a Shopee liberar o acesso
// e fornecer a documentação/endpoint aplicável à conta brasileira.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (!query) {
    return NextResponse.json(
      { status: "error", message: "Informe um produto para pesquisar." },
      { status: 400 }
    );
  }

  const credentialsConfigured = Boolean(
    process.env.SHOPEE_APP_ID && process.env.SHOPEE_SECRET
  );

  return NextResponse.json({
    status: "pending",
    source: "Shopee",
    query,
    credentialsConfigured,
    message: credentialsConfigured
      ? "As credenciais foram configuradas no servidor. Falta concluir a autenticação e a consulta conforme a documentação oficial liberada para sua conta."
      : "A busca está preparada, mas ainda aguardamos a liberação da Open API e as credenciais da Shopee."
  });
}
