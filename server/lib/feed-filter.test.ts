import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	isItemExcludedByTitle,
	parseExcludedTitleKeywords,
} from "./feed-filter";

describe("feed title filter", () => {
	it("parses comma and newline separated keywords", () => {
		assert.deepEqual(parseExcludedTitleKeywords(" canary, Beta\npreview "), [
			"canary",
			"beta",
			"preview",
		]);
	});

	it("matches a title by case-insensitive substring", () => {
		assert.equal(
			isItemExcludedByTitle(
				{ title: "Next.js 17 Canary Release" },
				"canary, beta",
			),
			true,
		);
	});

	it("does not exclude an article when no keyword matches", () => {
		assert.equal(
			isItemExcludedByTitle({ title: "Stable Release" }, "canary, beta"),
			false,
		);
	});
});
