import getCurrentPrice from "./getCurrentPrice";

const discountedPrice = (product) => {
  const price = getCurrentPrice(product?.prices);
  let totalDiscount = 0;
  product?.promotionPeriods.map(promotion => {
    if (promotion?.discountType === "percentage") {
      totalDiscount += (price * promotion?.discountValue) / 100;
    }

    if (promotion?.discountType === "fixed_amount") {
      totalDiscount += promotion?.discountValue;
    }
  })

  return price - totalDiscount;
}

export default discountedPrice;