import { useEffect, useState } from "react";

function SingleProductModal({ product, addCart, closeModal }) {
  //購物車數量
  const [cartQty, setCartQty] = useState(1);

  // ✅ 切換商品就重設
  useEffect(() => {
    if (!product?.id) return;
    setCartQty(1);
  }, [product?.id]);

  //
  const handleAddCart = () => {
    addCart(product.id, cartQty);
    setCartQty(1);
    closeModal();
  };

  return (
    <div className="modal" id="productModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-tible">產品名稱: {product.title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal} // ✅ 確保會清空 product → unmount
            ></button>
          </div>
          <div className="modal-body">
            <img width={200} height={200} src={product.imageUrl} />
            <p className="mt-3">產品内容: {product.content}</p>
            <p>產品描述: {product.description}</p>
            <p>
              價錢: <del>原價 ${product.origin_price}</del>, 特價 $
              {product.price}
            </p>
            <div className="d-flex align-items-center">
              <label style={{ width: "150px" }}>購買數量:</label>
              <button
                className="btn btn-danger"
                type="button"
                id="button-addon1"
                aria-label="Decrease quantity"
                onClick={() => setCartQty((prev) => Math.max(1, prev - 1))}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                className="form-control"
                type="number"
                value={cartQty}
                min="1"
                max="10"
                onChange={(e) => {
                  let value = Number(e.target.value);

                  if (Number.isNaN(value)) return;

                  // 夾在 1 ~ 10 之間
                  value = Math.max(1, Math.min(10, value));
                  setCartQty(value);
                }}
                onBlur={() => {
                  let value = Number(cartQty) || 1;
                  value = Math.max(1, Math.min(10, value));
                  setCartQty(value);
                }}
              />

              <button
                className="btn btn-primary"
                onClick={() => setCartQty((prev) => Math.min(10, prev + 1))}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleAddCart()}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProductModal;
