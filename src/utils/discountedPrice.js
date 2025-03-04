import getCurrentPrice from "./getCurrentPrice";

const discountedPrice = (product) => {
  const price = getCurrentPrice(product?.prices);
  if (product?.promotion?.discountType === "percentage") {
    return price - (price * product?.promotion?.discountValue) / 100;
  }

  if (product?.promotion?.discountType === "fixed_amount") {
    return price - product?.promotion?.discountValue;
  }
  return price;
}

export default discountedPrice;