# ToyStore

ToyStore is an e-commerce website specializing in toy products, providing users with a seamless shopping experience. Customers can browse products, view detailed information, search by image and voice, add items to their cart, and place orders with ease.

<p align="center">
  <img src="https://github.com/dhoaibao/ToyStore-Client/blob/main/public/home_page.png" alt="HomePage" width="45%" />
  <img src="https://github.com/dhoaibao/ToyStore-Client/blob/main/public/checkout.png" alt="CheckoutPage" width="45%" />
</p>

<p align="center">
  <img src="https://github.com/dhoaibao/ToyStore-Client/blob/main/public/product_detail.png" alt="ProductDetail" width="45%" />
  <img src="https://github.com/dhoaibao/ToyStore-Client/blob/main/public/order_detail.png" alt="OrderDetail" width="45%" />
</p>

***<p align="center">(Sample Screenshot)</p>***

## Key Features
- Browse toy products with detailed information.
- Add products to cart and complete orders.
- Image-based product search using vector embeddings (TransformerJS - Hugging Face).
- Voice search for finding products.
- Retrieve user's current location via Browser Geolocation API.
- User authentication with JWT and Google login (Firebase).
- OTP verification during user registration.
- Redis caching for user information and OTP validation.

## Technologies Used
- **Frontend:** React, Ant Design, Tailwind CSS
- **Backend:** Node.js, Express.js, PostgreSQL, Redis
- **Authentication:** JWT, Firebase Authentication (Google login)
- **Search:** Image Search with TransformerJS (Hugging Face), Cosine Similarity for vector comparison
- **Geolocation:** Browser Geolocation API
- **Storage:** Supabase Storage
