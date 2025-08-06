import "@/envConfig";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import { getSampleQueue } from "@/server/queues/sample-queue";

const app = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
	queues: [new BullMQAdapter(getSampleQueue())],
	serverAdapter,
});

const PORT = 3001;
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(PORT, () => {
	console.log(`Bull Board running at http://localhost:${PORT}/admin/queues`);
});
