"use client";

import { useState, type FormEvent } from "react";

type Product = {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  priceMin: number | null;
  priceMax: number | null;
  discount: number | null;
  sales: number | null;
  rating: number | null;
  shopName: string;
};

type SearchState = "idle" | "loading" | "success" | "error";

function formatPrice(value: number | null) {
  if (value === null) return null;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState<SearchState>("idle");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  async function buscarOfertas(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const termo = search.trim();

    if (termo.length < 2) {
      setProducts([]);
      setMessage("Digite pelo menos 2 caracteres para iniciar a busca.");
      setState("error");
      return;
    }

    setState("loading");
    setMessage("");
    setProducts([]);

    try {
      const response = await fetch(`/api/shopee?q=${encodeURIComponent(termo)}`);
      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch {
        const preview = responseText.replace(/\s+/g, " ").slice(0, 180);
        setMessage(`O servidor respondeu de forma inesperada (HTTP ${response.status}). ${preview || "Resposta vazia."}`);
        setState("error");
        return;
      }

      if (!response.ok || data.status !== "success") {
        const detail = data.diagnostic ? ` Detalhe técnico: ${data.diagnostic}` : "";
        setMessage((data.message || "Não foi possível consultar as ofertas agora.") + detail + ` (HTTP ${response.status})`);
        setState("error");
        return;
      }

      setProducts(data.products || []);
      setMessage(
        data.products?.length
          ? `${data.products.length} oferta(s) encontrada(s) na Shopee para “${termo}”.`
          : `Nenhuma oferta encontrada para “${termo}”. Tente outro termo.`
      );
      setState("success");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Falha desconhecida no navegador.";
      setMessage(`Falha ao chamar o servidor do MenorPreço: ${detail}`);
      setState("error");
    }
  }

  return (
    <main>
      <div className="top-strip">Compare preços • Encontre a melhor oferta</div>
      <header className="header">
        <a className="brand" href="#"><span className="brand-mark">M</span><span>menor<span className="brand-pink">preço</span><small>COMPARE. ECONOMIZE. ESCOLHA.</small></span></a>
        <nav><a href="#buscar">Buscar ofertas</a><a href="#como-funciona">Como funciona</a></nav>
        <span className="store-pill">🛍️ Shopee</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">COMPARADOR DE PREÇOS</span>
          <h1>O melhor preço<br />está <span>mais perto.</span></h1>
          <p>Pesquise um produto e encontre ofertas da Shopee em um só lugar. Compare opções e escolha a que faz mais sentido para você.</p>
          <form className="searchbar" id="buscar" onSubmit={buscarOfertas}>
            <span>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ex.: fone bluetooth, cafeteira..." aria-label="Produto para buscar" />
            <button type="submit" disabled={state === "loading"}>{state === "loading" ? "Buscando..." : "Buscar"}</button>
          </form>
          <div className="hero-notes"><span>✓ Ofertas consultadas na Shopee</span><span>✓ Links de afiliado</span></div>
        </div>
        <div className="hero-art"><div className="art-circle"><span className="big-tag">%</span><span className="floating f1">🏷️</span><span className="floating f2">🛍️</span><span className="floating f3">💸</span></div><div className="art-caption">Seu próximo achado começa aqui.</div></div>
      </section>

      <section className="products-section" id="ofertas">
        <div className="section-heading">
          <div><span className="eyebrow">BUSCA DE PRODUTOS</span><h2>Ofertas da Shopee <span>✦</span></h2><p>Resultados retornados pela Open API de afiliados da Shopee.</p></div>
        </div>

        {state === "loading" && (
          <div className="integration-panel" aria-live="polite">
            <div className="integration-icon">⌕</div>
            <div className="integration-content"><strong>Buscando ofertas...</strong><p>Estamos consultando os produtos na Shopee. Isso pode levar alguns segundos.</p></div>
          </div>
        )}

        {message && state !== "loading" && (
          <div className={`search-feedback ${state === "error" ? "search-feedback-error" : ""}`} role="status">{message}</div>
        )}

        {state === "success" && products.length > 0 && (
          <div className="product-grid">
            {products.map(product => {
              const price = formatPrice(product.priceMin);
              const priceMax = product.priceMax !== product.priceMin ? formatPrice(product.priceMax) : null;
              return (
                <article className="offer-card" key={product.id}>
                  <a className="offer-image" href={product.url} target="_blank" rel="noopener noreferrer">
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt={product.name} loading="lazy" />
                      : <span className="offer-image-fallback">🛍️</span>}
                    {product.discount !== null && product.discount > 0 && <span className="offer-discount">-{Math.round(product.discount)}%</span>}
                  </a>
                  <div className="offer-info">
                    <span className="offer-store">{product.shopName}</span>
                    <h3>{product.name}</h3>
                    {product.rating !== null && <div className="offer-rating">★ {product.rating.toFixed(1)} <span>na Shopee</span></div>}
                    <div className="offer-price">{price || "Ver preço na loja"}{priceMax && <small> até {priceMax}</small>}</div>
                    {product.sales !== null && <div className="offer-sales">{product.sales.toLocaleString("pt-BR")} vendidos</div>}
                    <a className="offer-button" href={product.url} target="_blank" rel="noopener noreferrer">Ver oferta na Shopee ↗</a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {state === "idle" && (
          <div className="integration-panel">
            <div className="integration-icon">🛍️</div>
            <div className="integration-content">
              <strong>Pesquise para encontrar ofertas reais</strong>
              <p>Digite o nome de um produto no campo acima. Vamos consultar a Shopee e mostrar os resultados disponíveis, com preço, imagem, vendedor e link de afiliado quando fornecidos pela API.</p>
              <span className="integration-status"><i /> Shopee conectada ao buscador</span>
            </div>
          </div>
        )}
        <p className="demo-note">Preços e disponibilidade podem mudar na loja. Confira o valor final, frete e condições antes de concluir a compra.</p>
      </section>

      <section className="how" id="como-funciona"><span className="eyebrow">FÁCIL ASSIM</span><h2>Comprar bem começa <span>comparando.</span></h2><div className="steps"><div><b>01</b><strong>Busque</strong><p>Digite o produto que deseja encontrar.</p></div><div><b>02</b><strong>Compare</strong><p>Analise preços, vendedores e condições.</p></div><div><b>03</b><strong>Economize</strong><p>Acesse a loja e aproveite a oferta escolhida.</p></div></div></section>
      <footer><a className="brand" href="#"><span className="brand-mark">M</span><span>menor<span className="brand-pink">preço</span><small>COMPARE. ECONOMIZE. ESCOLHA.</small></span></a><span>Feito para ajudar você a comprar melhor. © 2026 MenorPreço.</span></footer>
    </main>
  );
}
