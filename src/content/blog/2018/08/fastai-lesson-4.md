---
title: "Notes for: Fast.ai 2018 - Lesson 4: Structured data, time series and language models"
slug: fastai-lesson-4
publishDate: 2018-08-07T18:00:00Z
tags: ["Tech notes", "Fast.ai", "Machine Learning", "Deep Learning", "NLP"]
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/gbceqO8PpBg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Intro

**Reminder**: An activation is just a number that is calculated based on some weights (parameters) and the previous layer activations or inputs.

## Dropout

Is a technique to help with overfitting. A layer with dropout p=0.5 means that each activation of a particular layer has a probability of 0.5 to make become zero. Each minibatch we throw away different activations, based on the probability. Interestingly enough this forces the the model to not overfit that much.

When one particular activation that is very strong predictor gets dropped out for an iteration it forces the rest of the network to generalize better.

This has been around for 4-5 years and it has solved a lot the problem of generalization.

There is a trade off between high p values generalize better but decrease the training accuracy, low p values generalize worst but gives you less quick training accuracy. You might have to train for longer.

Why in early training is the validation loss better than the training loss? This is a little bit surprising since the model has not seen the validation dataset. The reason is that when we do inference we remove the dropout, we don't want to remove anything and instead use the best model we have.

In the backend Pytorch and Tensorflow does some balancing so accommodate the dropout, for example for p=0.5 after it remove half the activations it doubles the other half. The idea is to delete things without propagating it, so we need to do that balance.

How to pick the probability of the multiple dropout layers? In general 0.25 - 0.5 is probably a good number to start, if the model starts to overfit start increasing it. The bigger the network is (Resnet 24 vs Resnet 50) it could start to overfit more so it increasing dropout might be a good idea.

Overfitting is when Train loss is (a lot?) lower Validation loss but at the end the main objective is to get the validation loss low, maybe even if its overfitting a little bit. For each problem you need to get a sense of how much overfitting is good and bad.

## Structured data

The example is quite simple, predict the number of Sales for a store based on promotions, date, holidays and other data.

Some features that are contiguous like years it some times works better to treat them as categorical and encode them. This is because the model will have to find a function for a variable like years and get a meaning for 1990.7 that kinda doesn't make sense. Also values of other features from one year to the other can change drastically.

All features that are floats for sure keep them as continuous features. Use common sense.

Scaling is very important. Always scale the features to have a std between 0-1, be careful with outliers.

**Tip:** You never put a Relu in the last layer. Softmax is usually the last layer of the model and it needs the negatives that Relu removes to give low probabilities.

A very simple view of a Fully Connected NN is: `Input (Rank 1 Tensor) -> Linear Layer -> Relu (activation) -> Linear Layer (Nx1) -> Softmax -> Output` .

The model above assumes all the values are contiguous, what about the categorical variables? We do an embedding.

For example imagine the feature of `DayOfTheWeek` that has 7 values. So we will create an embedded matrix for `NX7`, where we pick N as the number of embedding that we want, for example 4. So when we need to get the input for one value (e.g. Sunday) we go to the embedding matrix and we pick the N values for Sunday. That way we have the Rank 1 Tensor we need for the input.

The embeddings start randomly and will get updated by the training.

We need one embedding matrix per categorical feature.

Embedding can mean a lot of things (or nothing), for example for the IMDB movies dataset embedding can mean: Action, RomCom or another category. This can be quite helpful to visualize. They can also mean not much and be just a good parameter to make predictions.

Why not doing dummy/one hot encoding? This is completely possible and another valid approach. If we do dummy encoding, the concept of "Sunday" for example can only be associated with a single floating point number, instead of the N size of the embedding. If instead we make "Sunday" a concept in a N dimensional space, we tend to find that this vectors start to represent rich semantic concepts, for example weekends.

So even if the one hot encoding is higher dimension than the N of embedding they might not be as meaningful as the embedding since they are all ones and zeros. It really depends on a lot of factors. Embeddings can also use less memory if N \< number of categories.

Domain knowledge and feature engineering is always important in this types of tasks. For tasks like this the deep learning model encodes a lot of information about time series analysis without doing any of that directly.

## NLP

In general using Deep Learning for NLP is not as studied as for image classification so there is not that many pre-trained models.

The example used was to classify movies reviews from IMDB between positive and negative.

Tokenizing is super important and spacy has the best tokenizer right now. Also remove the tokens that don't show up as much (\< 15 aprox).

Before we start training a model for positive or negative comments we want to get a model that is just good at "understanding english", this could me for example just predicting the next word of a sentence.

What this initial model does is to concatenate all the tokenized reviews into one huge block of text and split it into sections of contiguous tokens of size K, for example 64. So the input is going to be example `NxK` (where `N = total number of tokens / K`).

Then the actual input batches size (bptt) is going to take from that matrix, this can be for example 70.

The output that we are trying to predict is going to be a rank one tensor of the next token of the sentence (input). This is kinda hard to explain but easy to see on the video.

With an input and output we can train a model. What we do is generate an embedding similar as with the categorical variables. The embedding matrix will be of size `N tokens x K`, K is the size of the embedding vector for example 300.

**Tip - Gradient clipping:** Is a max value (e.g. 0.3) that is the max step that the optimizer will do in a giving iteration, this is quite useful for bit learning rates to keep the optimizer on track.

While there is not a lot of pre-trained models for NLP there is some created pre-trained embeddings for words such as word2vec and glove and we could use them as a starting point.

Now that we have a language model we want to use it and finetune it to do classification, in this case the positive and negative reviews.

## Other readings

- [Improving the way we work with learning rate ](https://techburst.io/improving-the-way-we-work-with-learning-rate-5e99554f163b)
- [The Cyclical Learning Rate technique](http://teleported.in/posts/cyclic-learning-rate/)
- [How (and why) to create a good validation set ](http://www.fast.ai/2017/11/13/validation-sets/)
