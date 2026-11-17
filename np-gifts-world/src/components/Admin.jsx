
import { useState } from "react";
import { Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";

const emptyProduct = {
  name: "",
  category: "Jewellery",
  price: "",
  description: "",
  image: "",
  emoji: "🎁",
};

function Admin({ products, setProducts, onClose }) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  function updateField(e) {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  }

  function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((old) => ({ ...old, image: reader.result }));
      setMessage("");
    };
    reader.readAsDataURL(file);
  }

  function saveProduct(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      setMessage("Enter a product name and a valid price.");
      return;
    }

    if (editingId !== null) {
      setProducts((old) =>
        old.map((p) =>
          p.id === editingId
            ? { ...p, ...form, price: Number(form.price) }
            : p
        )
      );
      setMessage("Product updated successfully!");
    } else {
      const newProduct = {
        ...form,
        id: Date.now(),
        price: Number(form.price),
      };
      setProducts((old) => [...old, newProduct]);
      setMessage("Product added successfully!");
    }

    setForm(emptyProduct);
    setEditingId(null);
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      ...emptyProduct,
      ...product,
      price: String(product.price),
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteProduct(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((old) => old.filter((p) => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyProduct);
      }
      setMessage("Product deleted.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyProduct);
    setMessage("");
  }

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <p className="eyebrow">STORE MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Manage your NP Gifts World products.</p>
        </div>
        <button className="admin-close" onClick={onClose}>
          <X size={20} /> Close
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="admin-stat">
          <span>Categories</span>
          <strong>{new Set(products.map((p) => p.category)).size}</strong>
        </div>
      </div>

      <div className="admin-form-card">
        <h2>{editingId !== null ? "Edit Product" : "Add New Product"}</h2>

        <form onSubmit={saveProduct}>
          <label>Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Example: Pearl Necklace"
            required
          />

          <label>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={updateField}
          >
            <option>Jewellery</option>
            <option>Gifts</option>
            <option>Bags</option>
            <option>Watches</option>
            <option>Accessories</option>
          </select>

          <label>Price (₹) *</label>
          <input
            type="number"
            name="price"
            min="1"
            value={form.price}
            onChange={updateField}
            placeholder="Enter selling price"
            required
          />

          <label>Product Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            placeholder="Write about your product..."
            rows="3"
          />

          <label>Product Image</label>
          <label className="upload-area">
            <ImagePlus size={30} />
            <span>Click here to upload product photo</span>
            <small>JPG, PNG or WEBP – Maximum 2 MB</small>
            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              hidden
            />
          </label>

          {form.image && (
            <div className="image-preview">
              <img src={form.image} alt="Product preview" />
              <button type="button" onClick={() =>
                setForm((old) => ({ ...old, image: "" }))
              }>
                Remove image
              </button>
            </div>
          )}

          {message && <p className="admin-message">{message}</p>}

          <div className="admin-actions">
            <button className="save-product" type="submit">
              <Plus size={17} />
              {editingId !== null ? "Update Product" : "Add Product"}
            </button>

            {editingId !== null && (
              <button type="button" className="cancel-product" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-products">
        <h2>Manage Products ({products.length})</h2>

        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          products.map((product) => (
            <div className="admin-product-row" key={product.id}>
              <div className="admin-product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <span>{product.emoji || "🎁"}</span>
                )}
              </div>

              <div className="admin-product-details">
                <strong>{product.name}</strong>
                <span>{product.category}</span>
                <b>₹{product.price}</b>
              </div>

              <div className="admin-product-actions">
                <button onClick={() => editProduct(product)} title="Edit">
                  <Pencil size={17} />
                </button>
                <button onClick={() => deleteProduct(product.id)} title="Delete">
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
