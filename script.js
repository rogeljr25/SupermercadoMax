import React, { useState } from 'react';

// Dados simulados de produtos
const initialProducts = [
  {
    id: 1,
    title: 'Air Fryer Digital 4L',
    category: 'Eletroportáteis',
    price: 259.90,
    oldPrice: 329.90,
    image: 'https://via.placeholder.com/200?text=Air+Fryer',
    badge: '-21%'
  },
  {
    id: 2,
    title: 'Liquidificador 1200W Inox',
    category: 'Eletroportáteis',
    price: 119.90,
    oldPrice: 159.90,
    image: 'https://via.placeholder.com/200?text=Liquidificador',
    badge: '-25%'
  },
  {
    id: 3,
    title: 'Cafeteira Express 15 Bar',
    category: 'Eletroportáteis',
    price: 489.00,
    oldPrice: 599.00,
    image: 'https://via.placeholder.com/200?text=Cafeteira',
    badge: 'Oferta'
  },
  {
    id: 4,
    title: 'Kit Mantimentos Inox 5 Pçs',
    category: 'Utensílios',
    price: 89.90,
    oldPrice: 110.00,
    image: 'https://via.placeholder.com/200?text=Kit+Inox',
    badge: 'Novo'
  }
];

export default function SuperMaxHome() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  // Adicionar ao carrinho
  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Filtragem de produtos por busca
  const filteredProducts = initialProducts.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.appContainer}>
      {/* 1. Header Principal */}
      <header style={styles.header}>
        <div style={styles.logo}>SuperMax</div>
        
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar produtos, marcas e categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.searchBtn}>🔍</button>
        </div>

        <div style={styles.userActions}>
          <button style={styles.iconBtn}>👤 Minha Conta</button>
          <div style={styles.cartBadge}>
            🛒 Carrinho <b>({cart.length})</b>
          </div>
        </div>
      </header>

      {/* 2. Barra de Categorias Rápida */}
      <nav style={styles.categoryNav}>
        <a href="#encarte" style={styles.navLink}>% Encarte do Dia</a>
        <a href="#clube" style={styles.navLink}>★ Clube Max</a>
        <a href="#cupons" style={styles.navLink}>🏷️ Cupons</a>
        <a href="#cashback" style={styles.navLink}>💰 Cashback</a>
        <a href="#cartao" style={styles.navLink}>💳 Cartão SuperMax</a>
      </nav>

      <main style={styles.mainContent}>
        {/* 3. Banners Promocionais */}
        <section style={styles.bannerGrid}>
          <div style={styles.bannerCard}>
            <p style={styles.bannerTag}>Exclusivo Cartão SuperMax</p>
            <h3>Com até 20x sem juros + Frete Grátis</h3>