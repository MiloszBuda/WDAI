import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import productRoutes from "./routes/product.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
