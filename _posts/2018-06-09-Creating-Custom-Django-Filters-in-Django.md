---
layout: post
title:  "Creating Custom Django Filters in Django"
date:   2018-06-09
image:  
tags:   [Django, Python, Custom-Filters]
---

In django's template framework, there is a wide variety of implicit filters which you can use for different purposes in your application. Filters are functions which control any input which is coming from template. For example you can capitalize a string with following syntax.

```python
{% raw %}{{ string|upper }}{% endraw %}
```

In above example, upper is the filter which is converting value coming into string into upper case.

<!--more-->

## Why Custom Filters

Sometimes you may end up requiring usefulness that is not fulfilled by Django’s builtin filters. You can amplify the layout motor by characterizing custom filters utilizing Python, and afterward make them accessible to your templates/layouts like this.

```python
{% raw %}{% load custom_filters %}{% endraw %}
```

## How to create custom filters

Filters are defined in similar manner in which we def a function. It can take arguments and will return answer after manipulating arguments. You can also take inputs and return results as html. Custom filter should be in file which will be in the template tags directory.For a module to be a legitimate label library, it should have a template.Library instance, where all the filters are enrolled. In this way, near to the highest point of your module, place the accompanying:

```python
from django import template
register = template.Library()
```

## Registering custom filters
When you've composed your filter definition, you have to enlist it with Library instance of yours, to make it accessible to Django's template language:

```python
register.filter('filtername', filtername)
```

You can register filter also as decorator like this
		Example
```python
@register.filter(name='filtername')
```

This line should be written just before the filter definition.

## Giving arguments to custom filter function

Custom filters are used in same manner as we use built in filters like this.

```python
{% raw %}{{ string|custom_filter}}{% endraw %}
```

Where custom_filter is name of filter. The filter will have one argument and value of string will be passed to that argument. You can pass maximum of two arguments to a custom filter. Syntax is like this

```python
{% raw %}{{ string|custom_filter: second_argument}}{% endraw %}
```

Where string is first argument.
More than two arguments are not supported in Django template language. You can use this approach if you want to pass a hard coded string to your filter.

```python
{% raw %}{{ string|custom_filter: “ ‘second_argument’, ‘third_argument’ “}}{% endraw %}
```

Then you can split string in you filter to perform your task. You can send more than one arguments by preprocessing data in view and putting it in a dictionary or you have to use custom tags.

## Example
Suppose you are required to make a filter which will return required value in a dictionary.
Here are steps to do this
Now create a directory templatetags  in the same level at which models.py and views.py are and create `__init__.py` in that directory. In this way this directory will be treated as python  package. Now create a file custom_filters.py in that directory.
Write following code in custom_filters.py.
