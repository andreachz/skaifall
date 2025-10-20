while IFS=, read -r filename label; do
  # skip header line
  [[ $filename == "filename" ]] && continue
  mv "$filename" "${filename%.jpg}_${label}.jpg"
done < labels.csv
