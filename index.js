import dotenv from "dotenv";
dotenv.config();
import connections from "./Database/database.config.js";
import app from "./app.js";

connections()
  .then(() => {
    console.log("Database connection established on port");
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is running on port ${process.env.APP_PORT} 🔥🔥🔥🔥`);
    });
  })
  .catch(() => {
    console.log(
      `server  connection failed on port ${process.env.APP_PORT}😵‍💫😵‍💫😭 `
    );
  });
