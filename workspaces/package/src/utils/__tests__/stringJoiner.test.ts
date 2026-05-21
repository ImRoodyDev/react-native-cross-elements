import {joinClsx} from "../stringJoiner";

describe("joinClsx", () => {
	it("returns undefined when base is undefined", () => {
		expect(joinClsx(undefined, "active")).toBeUndefined();
	});

	it("returns undefined when base is empty or whitespace only", () => {
		expect(joinClsx("", "active")).toBeUndefined();
		expect(joinClsx("   ", "active")).toBeUndefined();
	});

	it("joins single class with prefix", () => {
		expect(joinClsx("btn", "active")).toBe("btn-active");
	});

	it("joins multiple classes with prefix, preserving spaces", () => {
		expect(joinClsx("btn primary", "active")).toBe("btn-active primary-active");
	});

	it("trims extra spaces between classes", () => {
		expect(joinClsx("  btn   primary  ", "active")).toBe("btn-active primary-active");
	});

	it("sanitizes trailing non-alphanumerics in base and leading non-alphanumerics in prefix", () => {
		expect(joinClsx("btn-", "-active")).toBe("btn-active");
		expect(joinClsx("btn-- remove$$", "**state")).toBe("btn-state remove-state");
	});

	it("does not append dash when cleaned prefix is empty", () => {
		expect(joinClsx("btn", "***")).toBe("btn");
		expect(joinClsx("btn primary", "   ")).toBe("btn primary");
	});

	it("handles alphanumeric prefixes and bases correctly", () => {
		expect(joinClsx("btn1-", "2active")).toBe("btn1-2active");
	});
});

