import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import Rating from "@/Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "@@/Store";
import { laptop_url } from "@@/config";
import PropTypes from "prop-types"; // Import PropTypes

function Product({ product }) {
  const navigate = useNavigate();
  // const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  // const {
  //   cart: { cartItems },
  // } = state;

  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `${laptop_url}/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };
  return (
    <div>
      <Card className="card h-100">
        <Link to={`/product/${product.slug}`}>
          <img
            src={`${product.image}`}
            className="card-img-top"
            alt={product.name}
            rel="preload"
          />
        </Link>
        <Card.Body>
          <Link to={`/product/${product.slug}`}>
            <Card.Title>{product.name}</Card.Title>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text>${product.price}</Card.Text>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Out of stock
            </Button>
          ) : (
            <Button onClick={() => addToCartHandler(product)}>
              Add to cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    numReviews: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    countInStock: PropTypes.number.isRequired,
    // Add other prop types based on your 'product' object structure
  }).isRequired,
};

export default Product;
