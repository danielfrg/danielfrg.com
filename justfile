default:
  just --list

notebooks:
  cd nbconvert; uv run python convert.py
