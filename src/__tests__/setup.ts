import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL auto-cleanup only triggers with vitest `globals: true`; register it
// explicitly so renders don't leak between tests.
afterEach(() => {
  cleanup();
});
