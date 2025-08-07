import "@/envConfig";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import { getCrawlQueue } from "@/server/queues/crawl-queue";

const app = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
	queues: [new BullMQAdapter(getCrawlQueue())],
	serverAdapter,
});

const PORT = 3001;
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(PORT, () => {
	console.log(`Bull Board running at http://localhost:${PORT}/admin/queues`);
});
