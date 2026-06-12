import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders with text", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(getByRole("button", { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("can be disabled", () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    expect(getByRole("button", { name: /disabled/i })).toBeDisabled();
  });
});
