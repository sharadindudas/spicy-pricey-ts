import app from "./app";
import { PORT } from "./config/config";
import { connectMongoDB } from "./utils/mongodb";

// Connection to mongodb
connectMongoDB()
    .then(() => {
        // Connection to server
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        if (err instanceof Error) {
            console.error(err.message);
        }
    });
