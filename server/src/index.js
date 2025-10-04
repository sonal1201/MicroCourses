import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import creatorRoute from "./routes/creatorRoute.js";
import adminRoute from "./routes/adminRoute.js";
import learnerRoute from "./routes/learnerRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/creator", creatorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/learner", learnerRoute);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
