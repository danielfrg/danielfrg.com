---
title: Plain markdown test
slug: markdown-templates
date: 2100-12-31
tags: ["Test"]
author: Daniel Rodriguez
---

<p class="tldr">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna.</p>

Lorem ipsum dolor sit amet, [consectetur](https://google.com) adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna. Morbi accumsan, risus eget porta consequat, tortor nibh blandit dui, in sodales quam elit non erat. [Aenean lorem dui](), lacinia a metus eu, accumsan dictum urna. Sed a egestas mauris, non porta nisi. Suspendisse eu lacinia neque. Morbi gravida eros non augue pharetra, condimentum auctor purus porttitor.

## Header 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna. Morbi accumsan, risus eget porta consequat, tortor nibh blandit dui, in sodales quam elit non erat. Aenean lorem dui, lacinia a metus eu, accumsan dictum urna. Sed a egestas mauris, non porta nisi. Suspendisse eu lacinia neque. Morbi gravida eros non augue pharetra, condimentum auctor purus porttitor.

Vivamus at ullamcorper lectus, eget bibendum lorem. Vivamus molestie molestie leo. Vestibulum et odio est. Nam nulla augue, cursus eu eros at, sagittis tempor metus.

- Item 1
- Item 2
- Item 3

### Header 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna. Morbi accumsan, risus eget porta consequat, tortor nibh blandit dui, in sodales quam elit non erat. Aenean lorem dui, lacinia a metus eu, accumsan dictum urna. Sed a egestas mauris, non porta nisi. Suspendisse eu lacinia neque. Morbi gravida eros non augue pharetra, condimentum auctor purus porttitor.

```python
id_ = 0
for directory in directories:
    rootdir = os.path.join('/Users/drodriguez/Downloads/aclImdb', directory)
    for subdir, dirs, files in os.walk(rootdir):
        for file_ in files:
            with open(os.path.join(subdir, file_), 'r') as f:
                doc_id = '_*%i' % id_
                id_ = id_ + 1

                text = f.read()
                text = text.decode('utf-8')
                tokens = nltk.word_tokenize(text)
                doc = ' '.join(tokens).lower()
                doc = doc.encode('ascii', 'ignore')
                input_file.write('%s %s\n' % (doc_id, doc))
```

#### Header 4

Phasellus a massa vitae [dolor tempor]() blandit non in massa. Fusce quis lacus fringilla, pulvinar libero ut, dignissim nunc. Sed eleifend aliquam tellus ut imperdiet. __Cras justo__ eros, convallis at risus quis, ullamcorper eleifend mi. Etiam porta, mauris pretium euismod lacinia, metus ante tempus quam, id varius elit neque et odio. Praesent lobortis lectus id massa porttitor cursus.

> Pellentesque pretium euismod laoreet. Nullam eget mauris ut tellus vehicula consequat. In sed molestie metus. Nulla at varius nunc, sit amet semper arcu. Integer tristique augue eget auctor aliquam. Donec ornare consectetur lectus et viverra. Duis vel elit ac lectus accumsan gravida non ac erat.

Ut in ipsum id neque pellentesque iaculis. Pellentesque massa erat, rhoncus id auctor vel, tempor id neque. Nunc nec iaculis enim. Duis eget tincidunt tellus. Proin vitae ultrices velit.

1. Item 1
2. Curabitur vel enim at mi dictum venenatis eget eu nulla. Suspendisse potenti. Etiam vitae nibh a odio dictum aliquam. Sed sit amet adipiscing leo, vitae euismod arcu.
3. Item 3

Sed vestibulum justo et turpis ullamcorper, a interdum sapien tristique. Donec ullamcorper ipsum ac scelerisque lacinia. Quisque et eleifend odio. Curabitur vel enim at mi dictum venenatis eget eu nulla. Suspendisse potenti. Etiam vitae nibh a odio dictum aliquam. Sed sit amet adipiscing leo, vitae euismod arcu.

This is just an image

![Alt text](http://img3.wikia.nocookie.net/__cb20130524024810/logopedia/images/f/fa/Apple_logo_black.svg "Image")

Sed vestibulum justo et turpis ullamcorper, a interdum sapien tristique. Donec ullamcorper ipsum ac scelerisque lacinia. Quisque et eleifend odio. Curabitur vel enim at mi dictum venenatis eget eu nulla. Suspendisse potenti. Etiam vitae nibh a odio dictum aliquam. Sed sit amet adipiscing leo, vitae euismod arcu.

This is a `figure`!!

{{< figure src="https://vignette.wikia.nocookie.net/filmguide/images/1/1f/Netflix.png" title="Netflix" >}}

Sed vestibulum justo et turpis ullamcorper, a interdum sapien tristique. Donec ullamcorper ipsum ac scelerisque lacinia. Quisque et eleifend odio. Curabitur vel enim at mi dictum venenatis eget eu nulla. Suspendisse potenti. Etiam vitae nibh a odio dictum aliquam. Sed sit amet adipiscing leo, vitae euismod arcu.

<hr>

Sed vestibulum justo et turpis ullamcorper, a interdum sapien tristique. Donec ullamcorper ipsum ac scelerisque lacinia. Quisque et eleifend odio. Curabitur vel enim at mi dictum venenatis eget eu nulla. Suspendisse potenti. Etiam vitae nibh a odio dictum aliquam. Sed sit amet adipiscing leo, vitae euismod arcu.

<p class="note">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna. Morbi accumsan, risus eget porta consequat, tortor nibh blandit dui, in sodales quam elit non erat. Aenean lorem dui, lacinia a metus eu, accumsan dictum urna. Sed a egestas mauris, non porta nisi. Suspendisse eu lacinia neque. Morbi gravida eros non augue pharetra, condimentum auctor purus porttitor.</p>

<p class="update">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna. Morbi accumsan, risus eget porta consequat, tortor nibh blandit dui, in sodales quam elit non erat. Aenean lorem dui, lacinia a metus eu, accumsan dictum urna. Sed a egestas mauris, non porta nisi. Suspendisse eu lacinia neque. Morbi gravida eros non augue pharetra, condimentum auctor purus porttitor.</p>

<p class="alert">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur purus mi, sollicitudin ac justo a, dapibus ultrices dolor. Curabitur id eros mattis, tincidunt ligula at, condimentum urna. Morbi accumsan, risus eget porta consequat, tortor nibh blandit dui, in sodales quam elit non erat. Aenean lorem dui, lacinia a metus eu, accumsan dictum urna. Sed a egestas mauris, non porta nisi. Suspendisse eu lacinia neque. Morbi gravida eros non augue pharetra, condimentum auctor purus porttitor.</p>

