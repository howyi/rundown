import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasSummarizableContent } from "./article-content";

describe("article content", () => {
	it("treats an empty string as not summarizable", () => {
		assert.equal(hasSummarizableContent(""), false);
	});

	it("treats whitespace-only content as not summarizable", () => {
		assert.equal(hasSummarizableContent(" \n\t "), false);
	});

	it("allows non-empty content to be summarized", () => {
		assert.equal(hasSummarizableContent("Article body"), true);
	});
});
