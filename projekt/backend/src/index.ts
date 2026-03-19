import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://wdai-hffhju0hz-miloszbudas-projects.vercel.app",
      "https://wdai-p7zrgiowd-miloszbudas-projects.vercel.app",
      "https://wdai-git-main-miloszbudas-projects.vercel.app",
      "https://wdai-plum.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
