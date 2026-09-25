import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = ['Todos', 'Pan dulce', 'Hojaldre', 'Pan artesanal', 'Horneado', 'Repostería']

function App() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/products').then((response) => response.json()).then(setProducts).catch(() => setNotice('No pudimos conectar con la panadería.'))
  }, [])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todos' || product.category === category
    return matchesCategory && product.name.toLowerCase().includes(search.toLowerCase())
  }), [category, products, search])
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} agregado al pedido`)
  }

  const removeFromCart = (productId) => setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0))

  const submitOrder = async (event) => {
    event.preventDefault()
    const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: customer.name, customerPhone: customer.phone, items: cart, total }) })
    const result = await response.json()
    setNotice(result.message || result.error)
    if (response.ok) { setCart([]); setCustomer({ name: '', phone: '' }); setCheckoutOpen(false) }
  }

  return (
    <div className="storefront">
      <header className="topbar"><a className="brand" href="#inicio"><span>✦</span> La Espiga</a><nav><a href="#menu">El menú</a><a href="#historia">Nuestra historia</a></nav><button className="cart-button" type="button" onClick={() => setCheckoutOpen(true)}>Pedido <strong>{cartCount}</strong></button></header>
      <main>
        <section className="hero" id="inicio"><div><p className="eyebrow">Panadería artesanal · Desde 1998</p><h1>Hecho lento.<br /><em>Disfrutado</em> rápido.</h1><p className="hero-copy">Pan recién horneado, ingredientes honestos y ese aroma que convierte una mañana cualquiera en una buena mañana.</p><a className="primary-link" href="#menu">Ver el menú <span>↓</span></a></div><div className="hero-art"><div className="sun"></div><div className="loaf">🥐</div><p>Horneamos<br />cada día</p></div></section>
        <section className="menu-section" id="menu"><div className="section-heading"><div><p className="eyebrow">Del horno a tu mesa</p><h2>Elige algo rico</h2></div><label className="search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto" /></label></div><div className="categories">{categories.map((item) => <button className={category === item ? 'active' : ''} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>)}</div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className={`product-image ${product.image}`}><span>{product.image === 'croissant' ? '🥐' : product.image === 'dona' ? '🍩' : product.image === 'tarta' ? '🍰' : product.image === 'hogaza' ? '🍞' : '🥨'}</span>{product.featured ? <b>Favorito</b> : null}</div><div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>${Number(product.price).toFixed(2)}</strong></div><button className="add-button" type="button" onClick={() => addToCart(product)}>Agregar al pedido <span>+</span></button></article>)}</div></section>
        <section className="story" id="historia"><p className="eyebrow">La receta de la casa</p><h2>Buenos ingredientes.<br /><em>Mucho tiempo.</em></h2><p>Creemos que el pan no debe tener prisa. Cada masa se prepara a mano, fermenta con paciencia y se hornea cuando está lista.</p></section>
      </main>
      <footer><span>✦ La Espiga</span><small>Pan artesanal para todos los días</small><small>Querétaro, México · 07:00 — 20:00</small></footer>
      {notice ? <button className="notice" type="button" onClick={() => setNotice('')}>{notice} ×</button> : null}
      {checkoutOpen ? <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}><section className="checkout" onClick={(event) => event.stopPropagation()}><button className="close" type="button" onClick={() => setCheckoutOpen(false)}>×</button><p className="eyebrow">Tu pedido</p><h2>Listo para hornear</h2>{cart.length ? <><div className="cart-items">{cart.map((item) => <div key={item.id}><span>{item.quantity} × {item.name}</span><button type="button" onClick={() => removeFromCart(item.id)}>−</button><strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong></div>)}</div><div className="total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><form onSubmit={submitOrder}><input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Tu nombre" /><input required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Teléfono" /><button className="primary-link" type="submit">Confirmar pedido <span>→</span></button></form></> : <p className="empty">Tu pedido está vacío. Agrega algo del menú.</p>}</section></div> : null}
    </div>
  )
}

export default App
