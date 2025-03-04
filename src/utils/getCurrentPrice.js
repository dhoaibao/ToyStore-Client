export default function getCurrentPrice(prices) {
    const price = prices.find(item => !item.endDate).price;
    return price;
};