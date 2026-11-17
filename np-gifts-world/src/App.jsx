
import { useEffect, useState } from "react";
import "./index.css";
import Admin from "./components/Admin";
import {
  Settings, ShoppingCart, Trash2, Minus, Plus,
  ArrowLeft, CheckCircle, Package
} from "lucide-react";

const initialProducts = [
  { id: 1, name: "Elegant Pearl Necklace", category: "Jewellery", price: 299, emoji: "📿", label: "Bestseller" },
  { id: 2, name: "Cute Gift Box", category: "Gifts", price: 399, emoji: "🎁", label: "Popular" },
  { id: 3, name: "Stylish Handbag", category: "Bags", price: 599, emoji: "👜", label: "New" },
  { id: 4, name: "Classic Wrist Watch", category: "Watches", price: 499, emoji: "⌚", label: "Trending" },
  { id: 5, name: "Fashion Earrings", category: "Jewellery", price: 199, emoji: "✨", label: "Popular" },
  { id: 6, name: "Cute Accessories Set", category: "Accessories", price: 349, emoji: "💝", label: "New" },
];

const emptyCustomer = {
  name: "",
  phone: "",
  pincode: "",
  address: "",
  city: "",
  state: "",
};

function App() {
  const [products, setProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("npProducts")) || initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("npCart")) || [];
    } catch {
      return [];
    }
  });

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [page, setPage] = useState("home");
  const [customer, setCustomer] = useState(emptyCustomer);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("npProducts", JSON.stringify(products));
    } catch {
      alert("Storage is full. Please use smaller product images.");
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("npCart", JSON.stringify(cart));
    } catch {
      alert("Cart storage is full.");
    }
  }, [cart]);

  const categories = [
    "All", "Jewellery", "Gifts", "Bags", "Watches", "Accessories"
  ];

  const filteredProducts = products.filter((product) =>
    (category === "All" || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const heroProduct =
  products.find((product) => product.image) || products[0];
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 0
  );

  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  function addToCart(product) {
    setCart((old) => {
      const existing = old.find((item) => item.product.id === product.id);

      if (existing) {
        return old.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...old, { product, quantity: 1 }];
    });
    alert("Product added to cart!");
  }

  function changeQuantity(id, amount) {
    setCart((old) =>
      old
        .map((item) =>
          item.product.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id) {
    setCart((old) => old.filter((item) => item.product.id !== id));
  }

  function updateCustomer(e) {
    setCustomer((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  }

  function placeOrder(e) {
    e.preventDefault();
    setOrderError("");

    if (cart.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }

    const order = {
      orderId: "NP" + Date.now(),
      date: new Date().toLocaleString("en-IN"),
      customer: { ...customer },
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image || "",
      })),
      total,
      paymentMethod: "Cash on Delivery",
      status: "Order Placed",
    };

    try {
      const previousOrders = JSON.parse(
        localStorage.getItem("npOrders") || "[]"
      );
      localStorage.setItem(
        "npOrders",
        JSON.stringify([order, ...previousOrders])
      );
    } catch {
      setOrderError("Unable to save this test order. Please try again.");
      return;
    }

    setPlacedOrder(order);
    setCart([]);
    setCustomer(emptyCustomer);
    setPage("success");
  }

  if (showAdmin) {
    return (
      <Admin
        products={products}
        setProducts={setProducts}
        onClose={() => setShowAdmin(false)}
      />
    );
  }

  return (
    <div className="app">
      <div className="announcement">
        Welcome to NP Gifts World | Find something special today!
      </div>

      <header className="header">
        <a className="logo" href="#home" onClick={() => setPage("home")}>
          NP <span>GIFTS WORLD</span>
        </a>

        <nav>
          <a href="#home" onClick={() => setPage("home")}>Home</a>
          <a href="#shop" onClick={() => setPage("home")}>Shop</a>
          <a href="#categories" onClick={() => setPage("home")}>Categories</a>
          <a href="#footer" onClick={() => setPage("home")}>Contact</a>
        </nav>

        <div className="header-actions">
          <button className="cart-button" onClick={() => setPage("cart")}>
            <ShoppingCart size={16} /> Cart ({cartCount})
          </button>
          <button className="admin-button" onClick={() => setShowAdmin(true)}>
            <Settings size={16} /> Admin
          </button>
        </div>
      </header>

      {page === "home" && (
        <main>

<section className="premium-hero" id="home">
  <div className="premium-hero-content">
    <p className="premium-eyebrow">
      THE ART OF GIFTING
    </p>

    <h1>
      Thoughtful Gifts,
      <br />
      Beautiful Moments.
    </h1>

    <p className="premium-description">
      Discover timeless jewellery, beautiful gifts
      and everyday treasures, thoughtfully selected
      for you.
    </p>

    <div className="premium-hero-actions">
      <a href="#shop" className="premium-shop-button">
        Explore Collection <span>→</span>
      </a>

      <p>Made for moments that matter.</p>
    </div>

    <div className="premium-trust">
      <span>✧ Carefully Selected</span>
      <span>✧ Specially For You</span>
    </div>
  </div>

  <div className="premium-hero-visual">
    <div className="premium-image-frame">
      {heroProduct?.image ? (
        <img
          src={heroProduct.image}
          alt={heroProduct.name}
        />
      ) : (
        <div className="premium-placeholder">
          <span>NP</span>
          <p>GIFTS WORLD</p>
          <span className="placeholder-gift">✧</span>
        </div>
      )}
    </div>

    <div className="premium-floating-card">
      <span>OUR COLLECTION</span>
      <h3>{heroProduct?.name || "Special Gifts"}</h3>
      <p>Beautiful things, meaningful moments.</p>
    </div>

    <div className="premium-decoration">✧</div>
  </div>
</section>


          <section className="categories" id="categories">
            <div className="section-heading">
              <p className="eyebrow">EXPLORE OUR STORE</p>
              <h2>Shop by Category</h2>
            </div>

            <div className="category-list">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "category active" : "category"}
                  onClick={() => {
                    setCategory(item);
                    document.getElementById("shop").scrollIntoView();
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="products-section" id="shop">
            <div className="section-heading">
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>Our Products</h2>
              <p>Find your next favourite item.</p>
            </div>

            <input
              className="search"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <span className="product-label">{product.label || "New"}</span>
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span className="product-emoji">{product.emoji || "🎁"}</span>
                    )}
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-bottom">
                      <strong>₹{product.price}</strong>
                      <button onClick={() => addToCart(product)}>
                        Add to Cart +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="empty">No products found. Try another search.</p>
            )}
          </section>
        </main>
      )}

      {page === "cart" && (
        <main className="checkout-page">
          <button className="back-button" onClick={() => setPage("home")}>
            <ArrowLeft size={17} /> Continue Shopping
          </button>

          <h1>Your Shopping Cart</h1>
          <p className="checkout-subtitle">
            Review your selected products before checkout.
          </p>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={50} />
              <h2>Your cart is empty</h2>
              <p>Discover something special from our collection.</p>
              <button className="save-product" onClick={() => setPage("home")}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.product.id}>
                    <div className="cart-item-image">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} />
                      ) : (
                        <span>{item.product.emoji || "🎁"}</span>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h3>{item.product.name}</h3>
                      <p>{item.product.category}</p>
                      <strong>₹{item.product.price}</strong>

                      <div className="quantity-control">
                        <button onClick={() => changeQuantity(item.product.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.product.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() => removeItem(item.product.id)}
                      title="Remove product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <h2>Order Summary</h2>
                <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
                <div><span>Delivery</span><strong>FREE</strong></div>
                <div className="summary-total">
                  <span>Total</span><strong>₹{total}</strong>
                </div>
                <button className="save-product full-button" onClick={() => setPage("checkout")}>
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {page === "checkout" && (
        <main className="checkout-page">
          <button className="back-button" onClick={() => setPage("cart")}>
            <ArrowLeft size={17} /> Back to Cart
          </button>

          <h1>Checkout</h1>
          <p className="checkout-subtitle">Enter your delivery details.</p>

          <div className="checkout-layout">
            <form className="customer-form" onSubmit={placeOrder}>
              <h2>Delivery Information</h2>

              <label>Full Name *</label>
              <input name="name" value={customer.name} onChange={updateCustomer} required maxLength="80" placeholder="Enter your full name" />

              <label>Phone Number *</label>
              <input name="phone" type="tel" value={customer.phone} onChange={updateCustomer} required pattern="[6-9][0-9]{9}" maxLength="10" placeholder="10-digit mobile number" />

              <label>PIN Code *</label>
              <input name="pincode" inputMode="numeric" value={customer.pincode} onChange={updateCustomer} required pattern="[0-9]{6}" maxLength="6" placeholder="6-digit PIN code" />

              <label>Full Address *</label>
              <textarea name="address" value={customer.address} onChange={updateCustomer} required maxLength="300" rows="3" placeholder="House number, street, area..." />

              <label>City *</label>
              <input name="city" value={customer.city} onChange={updateCustomer} required maxLength="80" placeholder="Enter city" />

              <label>State *</label>
              <input name="state" value={customer.state} onChange={updateCustomer} required maxLength="80" placeholder="Enter state" />

              <h2 className="payment-heading">Payment Method</h2>
              <div className="cod-option">
                <Package size={23} />
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay when your order is delivered.</p>
                </div>
              </div>

              {orderError && <p className="order-error">{orderError}</p>}

              <button type="submit" className="save-product full-button">
                Place Order – ₹{total}
              </button>
            </form>

            <div className="order-summary">
              <h2>Your Order</h2>
              {cart.map((item) => (
                <div className="checkout-item" key={item.product.id}>
                  <span>{item.product.name} × {item.quantity}</span>
                  <strong>₹{item.product.price * item.quantity}</strong>
                </div>
              ))}
              <div><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div><span>Delivery</span><strong>FREE</strong></div>
              <div className="summary-total">
                <span>Total</span><strong>₹{total}</strong>
              </div>
              <p className="secure-note">Payment: Cash on Delivery</p>
            </div>
          </div>
        </main>
      )}

      {page === "success" && placedOrder && (
        <main className="success-page">
          <CheckCircle size={65} />
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with NP Gifts World.</p>

          <div className="success-card">
            <p>Order ID</p>
            <h2>{placedOrder.orderId}</h2>
            <div><span>Customer</span><strong>{placedOrder.customer.name}</strong></div>
            <div><span>Payment</span><strong>Cash on Delivery</strong></div>
            <div><span>Order Total</span><strong>₹{placedOrder.total}</strong></div>
            <div><span>Status</span><strong>Order Placed</strong></div>
          </div>

          <button className="save-product" onClick={() => {
            setPage("home");
            setPlacedOrder(null);
          }}>
            Continue Shopping
          </button>
        </main>
      )}

      <footer id="footer">
        <h2>NP GIFTS WORLD</h2>
        <p>Thoughtful gifts. Beautiful moments.</p>
        <p>© 2026 NP Gifts World. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
