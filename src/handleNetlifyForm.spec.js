import { encode, getSubject } from "./handleNetlifyForm";

import formDataExample from "./formData.json";

const context = {};

describe("encode", () => {
  beforeEach(() => {
    context.data = formDataExample;
  });
  it("should return a urlencoded string", () => {
    const actual = encode(context.data);
    expect(typeof actual).toBe("string");
    for (const [key, value] of Object.entries(context.data)) {
      expect(actual).toContain(encodeURIComponent(key));
      expect(actual).toContain(
        encodeURIComponent(value.name ? value.name : value),
      );
      expect(actual).toContain(
        `${encodeURIComponent(key)}=${encodeURIComponent(
          value.name ? value.name : value,
        )}`,
      );
    }
  });
  it("should sort the form data to a specific field", () => {
    const actual = encode(context.data, "name");
    console.log(actual);
    expect(actual.startsWith("name=")).toBeTruthy();
  });
});

describe("getSubject", () => {
  beforeEach(() => {
    context.data = formDataExample;
  });
  it("should return a subject string", () => {
    const actual = getSubject(context.data);
    console.log(actual);
    expect(typeof actual).toBe("string");
  });
});
