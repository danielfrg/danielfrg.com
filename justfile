default:
  just --list

notebooks:
  cd nbconvert; python convert.py
