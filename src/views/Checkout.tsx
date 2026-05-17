import CheckoutForm from "../components/CheckoutForm";

function Checkout() {
  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">
        Add your details to simulate a complete grocery order.
      </p>
      <CheckoutForm />
    </div>
  );
}

export default Checkout;

