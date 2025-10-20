def extract_code_and_batches_from_file(input_file: str, output_file: str):
    """
    Reads a text file and extracts (in original order):
    - All lines inside triple backtick code blocks
    - All lines containing 'Processing batch'
    Then writes the results to another file.
    """
    results = []
    inside_code = False

    with open(input_file, "r", encoding="utf-8") as f:
        for line in f:
            stripped = line.rstrip("\n")

            # Toggle code block detection
            if stripped.startswith("```"):
                inside_code = not inside_code
                continue  # skip the ``` markers themselves

            if inside_code or "Processing batch" in stripped:
                results.append(stripped)

    # Write results to output file
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(results))

    print(f"✅ Extracted content written to {output_file}")


# Example usage:
if __name__ == "__main__":
    extract_code_and_batches_from_file("results.csv", "res.csv")
