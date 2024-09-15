import { app } from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";

app.listen(PORT, async () => {
	console.log(`Server is up on http://localhost:${PORT}`);
	await connectDB();
});
