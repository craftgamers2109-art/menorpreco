"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number; name: string; category: string; store: string;
  price: number; oldPrice: number; rating: number; installments: string;
  tag: string; emoji: string;
};

const products: Product[] = [
  { id: 1, name: "Smartphone Galaxy A55 5G 256GB", category: "Celulares", store: "Loja Exemplo", price: 1799.90, oldPrice: 2299.90, rating: 4.8, installments: "10x de R$ 179,99", tag: "Oferta do dia", emoji: "📱" },
  { id: 2, name: "Notebook 15,6” Intel Core i5 8GB", category: "Informática", store: "Tech Store", price: 2899, oldPrice: 3499, rating: 4.7, installments: "10x de R$ 289,90", tag: "Menor preço", emoji: "💻" },
  { id: 3, name: "Fone Bluetooth com cancelamento de ruído", category: "Eletrônicos", store: "Mundo Digital", price: 249.90, oldPrice: 399.90, rating: 4.6, installments: "5x de R$ 49,98", tag: "-38%", emoji: "🎧" },
  { id: 4, name: "Smart TV 50” 4K UHD", category: "TV e vídeo", store: "Casa & Tech", price: 1899, oldPrice: 2499, rating: 4.9, installments: "10x de R$ 189,90", tag: "Oferta especial", emoji: "📺" },
  { id: 5, name: "Smartwatch esportivo GPS", category: "Eletrônicos", store: "Loja Exemplo", price: 329.90, oldPrice: 499.90, rating: 4.5, installments: "6x de R$ 54,98", tag: "-34%", emoji: "⌚" },
  { id: 6, name: "Cadeira de escritório ergonômica", category: "Casa", store: "Conforto Shop", price: 699, oldPrice: 899, rating: 4.7, installments: "10x de R$ 69,90", tag: "Boa oferta", emoji: "🪑" },
  { id: 7, name: "Console de videogame 1TB", category: "Games", store: "Game Center", price: 2899.90, oldPrice: 3299.90, rating: 4.9, installments: "10x de R$ 289,99", tag: "Destaque", emoji: "🎮" },
  { id: 8, name: "Air Fryer 5 litros digital", category: "Casa", store: "Cozinha Fácil", price: 379.90, oldPrice: 549.90, rating: 4.8, installments: "6x de R$ 63,32", tag: "-31%", emoji: "🍟" },
];

const categories = ["Todos", "Celulares", "Informática", "Eletrônicos", "TV e vídeo", "Casa", "Games"];
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("relevance");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const visible = useMemo(() => {
    const filtered = products.filter(p =>
      (category === "Todos" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.store.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === "price") filtered.sort((a, b) => a.price - b.price);
    if (sort === "discount") filtered.sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice);
    return filtered;
  }, [search, category, sort]);

  const toggle = (id: number, list: number[], setter: (v: number[]) => void) =>
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  return (
    <main>
      <div className="top-strip">🔥 Semana de ofertas • Compare antes de comprar</div>
      <header className="header">
        <a className="brand" href="#"><span className="brand-mark">M</span><span>menor<span className="brand-pink">preço</span><small>COMPARE. ECONOMIZE. ESCOLHA.</small></span></a>
        <nav><a href="#ofertas">Ofertas</a><a href="#categorias">Categorias</a><a href="#como-funciona">Como funciona</a></nav>
        <button className="compare-top" onClick={() => setShowCompare(true)}>⇄ Comparar <b>{compare.length}</b></button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">O jeito inteligente de comprar</span>
          <h1>O melhor preço<br />está <span>mais perto.</span></h1>
          <p>Encontre ofertas, compare valores e descubra onde seu dinheiro vale mais.</p>
          <div className="searchbar"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="O que você está procurando?" /><button onClick={() => document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" })}>Buscar</button></div>
          <div className="hero-notes"><span>✓ Comparação simples</span><span>✓ Ofertas em um só lugar</span></div>
        </div>
        <div className="hero-art"><div className="art-circle"><span className="big-tag">%</span><span className="floating f1">🏷️</span><span className="floating f2">🛍️</span><span className="floating f3">💸</span></div><div className="art-caption">Seu próximo achado começa aqui.</div></div>
      </section>

      <section className="trust-row"><div><strong>🔎</strong><span><b>Compare</b><small>Veja opções lado a lado</small></span></div><div><strong>💰</strong><span><b>Economize</b><small>Encontre bons preços</small></span></div><div><strong>❤️</strong><span><b>Escolha melhor</b><small>Decida com confiança</small></span></div></section>

      <section className="products-section" id="ofertas">
        <div className="section-heading"><div><span className="eyebrow">SELEÇÃO MENORPREÇO</span><h2>Ofertas em destaque <span>✦</span></h2><p>Produtos que merecem entrar no seu radar.</p></div><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar produtos"><option value="relevance">Ordenar: relevância</option><option value="price">Menor preço</option><option value="discount">Maior desconto</option></select></div>
        <div className="category-list" id="categorias">{categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="product-grid">{visible.map(p => <article className="product-card" key={p.id}>
          <div className="product-image"><span className="tag">{p.tag}</span><button className={favorites.includes(p.id) ? "heart chosen" : "heart"} onClick={() => toggle(p.id, favorites, setFavorites)} aria-label="Favoritar">{favorites.includes(p.id) ? "♥" : "♡"}</button><span className="product-emoji">{p.emoji}</span></div>
          <div className="product-info"><small className="product-category">{p.category}</small><h3>{p.name}</h3><div className="rating">★ {p.rating.toFixed(1)} <span>• {p.store}</span></div><div className="old-price">{money(p.oldPrice)}</div><div className="price">{money(p.price)}</div><div className="installments">{p.installments} sem juros*</div><button className={compare.includes(p.id) ? "compare-button selected" : "compare-button"} onClick={() => toggle(p.id, compare, setCompare)}>{compare.includes(p.id) ? "✓ Adicionado para comparar" : "＋ Adicionar para comparar"}</button></div>
        </article>)}</div>
        {visible.length === 0 && <div className="empty">Não encontramos produtos. Tente outra busca ou categoria.</div>}
        <p className="demo-note">* Demonstração: produtos, preços, lojas e avaliações são ilustrativos e ainda não representam ofertas reais.</p>
      </section>

      <section className="how" id="como-funciona"><span className="eyebrow">FÁCIL ASSIM</span><h2>Comprar bem começa <span>comparando.</span></h2><div className="steps"><div><b>01</b><strong>Busque</strong><p>Digite o produto que deseja encontrar.</p></div><div><b>02</b><strong>Compare</strong><p>Analise preços e opções disponíveis.</p></div><div><b>03</b><strong>Economize</strong><p>Escolha a oferta que faz sentido para você.</p></div></div></section>
      <footer><a className="brand" href="#"><span className="brand-mark">M</span><span>menor<span className="brand-pink">preço</span><small>COMPARE. ECONOMIZE. ESCOLHA.</small></span></a><span>Feito para ajudar você a comprar melhor. © 2026 MenorPreço.</span></footer>

      {showCompare && <div className="modal-backdrop" onClick={() => setShowCompare(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowCompare(false)}>×</button><span className="eyebrow">SUA SELEÇÃO</span><h2>Comparar produtos</h2>{compare.length ? <div className="compare-list">{products.filter(p => compare.includes(p.id)).map(p => <div key={p.id}><span>{p.emoji} {p.name}</span><b>{money(p.price)}</b><button onClick={() => toggle(p.id, compare, setCompare)}>Remover</button></div>)}</div> : <p>Adicione produtos para comparar os preços aqui.</p>}<button className="primary-button" onClick={() => setShowCompare(false)}>Continuar explorando</button></div></div>}
    </main>
  );
}
