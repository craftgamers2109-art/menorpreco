"use client";

import { useState } from "react";

type SearchState = "idle" | "loading" | "pending" | "error";

export default function Home() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState<SearchState>("idle");
  const [message, setMessage] = useState("");

  async function buscarOfertas(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const termo = search.trim();
    if (!termo) {
      setMessage("Digite o nome de um produto para iniciar a busca.");
      setState("error");
      return;
    }

    setState("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/shopee?q=${encodeURIComponent(termo)}`);
      const data = await response.json();
      setMessage(data.message || "A integração com a Shopee ainda está sendo preparada.");
      setState(data.status === "pending" ? "pending" : "error");
    } catch {
      setMessage("Não foi possível consultar o serviço agora. Tente novamente em instantes.");
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
          <p>Pesquise um produto e encontre ofertas de lojas confiáveis em um só lugar. Estamos começando pela Shopee.</p>
          <form className="searchbar" id="buscar" onSubmit={buscarOfertas}>
            <span>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ex.: fone bluetooth, cafeteira..." aria-label="Produto para buscar" />
            <button type="submit" disabled={state === "loading"}>{state === "loading" ? "Buscando..." : "Buscar"}</button>
          </form>
          <div className="hero-notes"><span>✓ Ofertas da Shopee</span><span>✓ Comparação em um só lugar</span></div>
        </div>
        <div className="hero-art"><div className="art-circle"><span className="big-tag">%</span><span className="floating f1">🏷️</span><span className="floating f2">🛍️</span><span className="floating f3">💸</span></div><div className="art-caption">Seu próximo achado começa aqui.</div></div>
      </section>

      <section className="products-section" id="ofertas">
        <div className="section-heading"><div><span className="eyebrow">PRIMEIRA LOJA</span><h2>Ofertas da Shopee <span>✦</span></h2><p>Os resultados reais aparecerão aqui quando a API estiver liberada e conectada.</p></div></div>
        <div className="integration-panel" aria-live="polite">
          <div className="integration-icon">🛍️</div>
          <div className="integration-content">
            <strong>{state === "loading" ? "Consultando integração..." : "Integração em preparação"}</strong>
            <p>{message || "Estamos aguardando a liberação da Open API da Shopee. Assim que tivermos acesso, esta área exibirá produtos, preços, vendedores e links de afiliado reais."}</p>
            <span className="integration-status"><i /> Aguardando acesso à API</span>
          </div>
        </div>
        <p className="demo-note">O MenorPreço ainda não consulta preços em tempo real. Nenhuma oferta fictícia será exibida como se fosse real.</p>
      </section>

      <section className="how" id="como-funciona"><span className="eyebrow">FÁCIL ASSIM</span><h2>Comprar bem começa <span>comparando.</span></h2><div className="steps"><div><b>01</b><strong>Busque</strong><p>Digite o produto que deseja encontrar.</p></div><div><b>02</b><strong>Compare</strong><p>Analise preços, vendedores e condições.</p></div><div><b>03</b><strong>Economize</strong><p>Acesse a loja e aproveite a oferta escolhida.</p></div></div></section>
      <footer><a className="brand" href="#"><span className="brand-mark">M</span><span>menor<span className="brand-pink">preço</span><small>COMPARE. ECONOMIZE. ESCOLHA.</small></span></a><span>Feito para ajudar você a comprar melhor. © 2026 MenorPreço.</span></footer>
    </main>
  );
}
