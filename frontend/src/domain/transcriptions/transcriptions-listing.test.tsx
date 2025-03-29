/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, expect, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useQuery } from "@tanstack/react-query";
import TranscriptionListing from "./transcriptions-listing";

// Mock dependencies
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));
vi.mock("@/components/data-table", () => ({
  DataTable: ({ data }: { data: object }) => (
    <div data-testid="data-table">{JSON.stringify(data)}</div>
  ),
}));
vi.mock("@/components/ui/input", () => ({
  Input: ({ className, value, onChange, type, placeholder }: any) => (
    <input
      className={className}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  ),
}));
vi.mock("@uidotdev/usehooks", () => ({
  useDebounce: (value: string) => value,
}));

describe("TranscriptionListing", () => {
  it("renders the input field and data table", () => {
    (useQuery as Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    render(<TranscriptionListing />);

    expect(screen.getByPlaceholderText("Search by filename")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("displays an error message when the query fails", () => {
    (useQuery as Mock).mockReturnValue({
      data: null,
      error: true,
      isLoading: false,
    });

    render(<TranscriptionListing />);

    expect(screen.getByText("Failed to retrieve transcriptions.")).toBeInTheDocument();
  });

  it("updates the search term when typing in the input field", async () => {
    (useQuery as Mock).mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });

    render(<TranscriptionListing />);

    const input = screen.getByPlaceholderText("Search by filename");
    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(input).toHaveValue("test");
    });
  });

  it("renders data in DataTable only after useQuery returns data value", () => {
    const { rerender } = render(<TranscriptionListing />);

    expect(screen.getByTestId("data-table").textContent).toBe("[]");

    const queryData = [{ id: 1, name: "Test Transcription" }];
    (useQuery as Mock).mockImplementation(() => ({
      data: queryData,
      error: null,
      isLoading: false,
    }));

    rerender(<TranscriptionListing />);

    expect(screen.getByTestId("data-table").textContent).toContain(JSON.stringify(queryData));
  });
});
