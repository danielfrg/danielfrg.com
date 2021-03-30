# Contributing

Create dev environment

```
make env
conda activate extrapolations.dev
```

Convert notebooks to markdown:

```
make notebooks
```

Build Theme:

```
cd theme
make npm-i
make npm-build
```

Generate site:

```
make build
```

Serve site

```
make serve
```

