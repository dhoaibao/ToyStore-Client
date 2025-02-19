const discountedPrice = (product) => {
    return (
        product?.promotions?.reduce((acc, discount) => {
          if (discount.discountType === "percentage") {
            return acc - (acc * discount.discountValue) / 100;
          }
  
          if (discount.discountType === "fixed_amount") {
            return acc - discount.discountValue;
          }
          return acc;
        }, product.price) || product.price
      );
}

export default discountedPrice;