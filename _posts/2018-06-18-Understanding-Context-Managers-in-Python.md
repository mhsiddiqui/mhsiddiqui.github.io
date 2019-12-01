---
layout: post
title:  "Understanding Context Managers in Python"
date:   2018-06-18
image:  
tags:   [Python, Context-Manager, Custom-Context-Manager, Python-Generators, Python-Resource-Management]
---
Python context managers provides a way to perform some pre processing and post processing related to your cast. This processing can be allocation and releasing of some kind of resources or any other custom task. Context managers are used using Python `with` statement. This is in below example.
```python
with something_that_returns_a_context_manager() as resource:
    foo(resource)
    print 'done using resource'
```

The most common use of context managers is Resource Management.

<!--more-->

## Uses of Context Managers

### Resource Management

Resource management, in simple word, can be called managing an organization’s resource in an efficient way when they are needed to increase productivity. In computing, resource management refers to effectively managing resources like RAM, ROM, network sockets, file handlers and power supply etc. We can say that resource management is management of resources and also using them only when they are needed and releasing resources when they have been used.

Every programming language has its own way of managing resources. In Python, this is done using context managers using `with` statemente which releases specific resources when execution of specific block of code has been completed. Context manager is actually an object which epitomized or encapsulated these resources. A normal use case of resource management using context manager is a file handling. Normally file handling is done like this.

```python
file = open(file_name)
# Read or write content of file here.
file.close()
```

The problem in this approach is that when there is some error in processing of file after it has been opened, file will remain open in memory. This problem can be solved by writing code like this.
```python
file = open(file_name)
try:
    # Read or write content of file here.
finally:
    file.close()
```
In this way, independent of the result (success/error) of code in `try` block, file will be closed in `finally` block. This resolve our problem but it require manual release of the resources. Using `with` statement, this can be done like this.
```python
with open(file_name) as file:
    # Read or write content of file here.
```
`with` statement will allocate resources to block of code executing insite `with` block and when execution of that block will be complete, it will release all the resources.

### Other Uses
There can be other usefull uses of context managers. These can be used anywhere where some pre and post processing is required for your task. An example is the management of Asynchronous tasks where you want to have record of each tasks you are adding in queue and marking its status (success/error). In pre processing of that task, you will add a record of that task in database and in post processing, you will mark its status.


## How Context Manager works
Context managers are very easy to understand. The main components of a context manager a two methods.
1. `__enter__()`
2. `__exit__()`

As we know context managers are enabled by `with` statement. They works by calling `__enter__()` when the `with` block is entered. It is like calling `__init__()` when object is created. It then binds return value to the target of `as`. The `__exit__()` function is called when the context is exited. Below it the example of file handling using context managers.

```python
class File(object):
    def __init__(self, file_name, method):
        self.file = open(file_name, method)

    def __enter__(self):
        return self.file

    def __exit__(self, type, value, traceback):
        print "Exception has been handled"
        self.file.close()
        return True

with File('file.txt', 'w') as file:
    foo(file)
```


## Writing a custom Context Manager

We can write custom context manager in Python. There are two different way of doing this.

1. Context Manager as Class
2. Generator as Context Manager

### Context Manager as Class

In this way, we will write a class with two methods mentioned above i.e. `__enter__()` and `__exit__()`. Lets first discuss a scenario for which we want to write a context manager.
We want to read or write a file. But our requirement is such that every file should have some text at start and end of file.

```python
class FileWithHeadingAndEnd(object):
    def __enter__(self):
		print 'Open'
        fo = open("foo.txt", "wb")
        fo.write( "File Heading\n")
        return fo

    def __exit__(self, exc_type, exc_val, exc_tb):
        fo.write( 'File End\n');
        fo.close()
        print 'Closed'
```
Print statements are only for understanding code structure. When you will run this code, print statement will tell you code execution order.  Below is the way to use this context manager. When you will run this, you will see file generated have a line at start and end of it.

```python
with FileWithHeadingAndEnd() as fo:
   # Code Block
    i = 0
    while i<10:
        fo.write("Line: %s \n" % str(i))
        i += 1

```
#### How this code works?
These are the steps which python interpreter will perform when it will find a with statement.
1. Python interpreter will store `FileWithHeadingAndEnd()` object in a temporary variable.
2. `with` statement will call `__enter__()` method of context manager object
3. `__enter__()` method will create a file, add heading in it and return it to `as` path of the context manager.
4. Code block under `with` statement will be executed.
5. `with` statement will call `__exit__()` method of context manager when code block has been executed.

#### What if error occur during Execution of code block?
Suppose an error occurs during execution of code block, following would be the steps taken by python interpreter
1. `with` statement will catch error
2. `with` statement will call `__exit__()` method of context manager with details of exception.
3. `__exit__()` method will close the file, and return `None` (In Python, if function do not have any return statement, it returns `None`)
4. `with` statement will check return value and if it is not true, it will re raise exception.

### Generator as Context Manager

In method mentioned above, we created context manager with class having `__enter__()` and `__exit__()` functions. In this method, we will use generator function as context manager.
This is shown in below example.
```python
import contextlib

@contextlib.contextmanager
def make_context():
    print '  entering'
    try:
        fo = open("foo2.txt", "wb")
        fo.write("File Heading\n")
        yield fo
    except RuntimeError, err:
        print 'ERROR:', err
    finally:
        print 'exiting'
    	fo.write('File End\n');
    	fo.close()
```
We can use this context manager in similar as above.
```python
with make_context() as fo:
    i = 0
    while i<10:
        fo.write("Line: %s \n" % str(i))
        i += 1
```
## Conclusion
Many use cases can be found for context manager. A good thing about context manager is that you have no need to remember to release resources. All the management is done by object itself.
