Title: word2vec in yhat: Word vector similarity
Slug: word2vec-yhat
Date: 2013-9-21
Tags: Python,word2vec,YHat,Machine learning
Author: Daniel Rodriguez
Include: angular,jquery

A [few weeks ago](http://google-opensource.blogspot.com/2013/08/learning-meaning-behind-words.html)
Google released some code to convert words to vectors called
[word2vec](https://code.google.com/p/word2vec/).
The company I am currently working on does something similar and I was quite amazed by the performance
and accuracy of Google's algorithm so I created a simple python wrapper to call the C code for training
and read the training vectors into numpy arrays, you can check it out on
[pypi (word2vec)](https://pypi.python.org/pypi/word2vec).

At the same time I found out about [yhat](http://yhathq.com/), I found about them
via twitter and after reading their blog I had to try their product. What they do is very simple
but very useful: take some python (scikit-learn) or R classifier and create a REST
endpoint to make predictions on new data. The product is still in very beta but the guys were
very responsive and they helped me to solve some of my issues.

The only restriction I had is the yhat limit for free accounts is 50 Mgs per classifier which on this
particular case is not enough so I had to reduce the vector size to 25 from the default (100).
And reduce it to only 70k vectors, so the results in the app below are a little limited, but the results
are very similar.

## Training

Using my [word2vec wrapper](https://pypi.python.org/pypi/word2vec) is as simple as download and unzip the text8 [(link)](http://mattmahoney.net/dc/text8.zip) file and:

```python
from word2vec import word2vec
word2vec('text8', 'text8-25.vec', size=25)
```

This created a file (`text8-25.vec`) with the vectors that can be loaded into numpy. Again using my [word2vec wrapper](https://pypi.python.org/pypi/word2vec) is really simple:

```python
from word2vec import WordVectors
vectors = WordVectors('text8-31.vec')
```

## Yhat

Then just need to create a yhat model and in the `predict` method calculate the distance between the vectors.
That code is also included on my word2vec package using scipy cosine distance ([example](http://nbviewer.ipython.org/urls/raw.github.com/danielfrg/word2vec/master/examples/demo-word.ipynb)),
on this case I just used the numpy `linalg.norm`.

```python
import numpy as np
from yhat import BaseModel

class Word2VecCLF(BaseModel):
    def transform(self, request):
        return request

    def predict(self, request):
        ''' Calculate distances
        '''
        target = request['word']
        n = request['n'] if 'n' in request else 10

        distances = [1e6 for i in range(n)]
        values = [None for i in range(n)]

        words = self.words
        vectors = self.vectors

        target_ix = np.where(words == target)[0]
        for word, vector in zip(words, vectors):
            if word != target:
                n_dist = np.linalg.norm(vectors[target_ix, :] - vector)

                if n_dist < max(distances):
                    if n_dist < min(distances):
                        distances.insert(0, n_dist)
                        distances = distances[:n]
                        values.insert(0, word)
                        values = values[:n]
                    else:
                        for i, dist_1 in enumerate(reversed(distances[:-1])):
                            dist_2 = distances[n - i - 1]
                            if n_dist < dist_2 and n_dist >= dist_1:
                                distances.insert(n - i - 1, n_dist)
                                distances = distances[:n]
                                values.insert(n - i - 1, word)
                                values = values[:n]
                                break
        return {'distances': distances, 'words': values}
```

Then just need to upload to yhat.

```python
from yhat import Yhat
yh = Yhat("EMAIL", "TOKEN")
yh.deploy("word2vec", word2vec_clf)
```

If everything goes fine you have a REST endpoint you can call.

<a id="example"></a>
## Example

I built a simple app using [angularJS](http://angularjs.org/).
Just type any word and the number of close word vectors you want and click the button.
On the list that it generates you can click on any word and it will give you the neighbors for that word.

<div ng-app="app">
    <div ng-controller="MainCtrl">
        <form class="form-inline" role="form" style="max-width: 550px; margin: 0 auto;">
            <div class="form-group">
                <input type="text" class="form-control" ng-model="form_word" placeholder="a word">
            </div>
            <div class="form-group">
                <input type="number" class="form-control" ng-model="form_n">
            </div>
            <button class="btn btn-default" ng-click="formRequest()">Request</button>
        </form>

        <table class="table" style="max-width: 350px; margin: 0 auto;">
            <thead>
                <tr>
                    <th>word</th>
                    <th>distance</th>
                </tr>
            </thead>
            <tr ng-repeat="word in words">
                <td><a href="#example" ng-click="listRequest(word.word)" eat-click>{{word.word}}</a></td>
                <td>{{word.distance}}</td>
            </tr>
        </table>
    </div>
</div>

<script type="text/javascript">


var app = angular.module('app', []);

app.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
})

var MainCtrl = function($scope, $http) {
    $scope.form_word = '';
    $scope.form_n = 10;
    $scope.words = [];

    $scope.formRequest = function() {
        $scope.request($scope.form_word, $scope.form_n);
    }

    $scope.listRequest = function(word) {
        $scope.request(word, $scope.form_n);
    }

    $scope.request = function(word, n) {
        var BASE_URL = 'http://cors.io/api.yhathq.com/predict?username=df.rodriguez143%40gmail.com&model=word2vec&apikey=5162184b820a6ac92274bec2e98b8c88&version=23';
        var data = {"data": {"word": word, "n": n} }

        $http.post(BASE_URL, data)
            .success(function (data, status, headers, config) {
                $scope.words = [];

                for (var i = 0; i < data.prediction.words.length; i++) {
                    $scope.words.push({"word": data.prediction.words[i],
                                       "distance": data.prediction.distances[i]});
                }
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
    }
}

</script>

## Conclusions

Definitely some interesting new technologies and tools to keep and eye on. Thanks to Google for
open sourcing the code and thanks to yhat for a good product. I had to do something similar a few
weeks ago and my solution was to use ZMQ to connect the rest endpoint with the actual
classifier yhat makes that possible in 5% of the time.

**Found some interesting relations?** Let me know in the comments below.
