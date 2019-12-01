---
layout: post
title:  "Part 2: Deploy Django using Nginx and Gunicorn/uWSGI - Celery Worker and Beat Setup"
date:   2018-12-25
image:  
tags:   [Python, Django, Django-Deployment, Gunicorn, uWSGI, Supervisor, Celery]
---

In Part 1, we setup a Django server using uWSGI/Gunicorn and Nginx. This server only contain one service which is our application server. But sometimes, our server can have more than one service e.g. Celery Worker and Celery Beat etc. These services can be run using Supervisor.

<!--more-->


# What is Celery

Celery is a simple, flexible, and reliable distributed system to process vast amounts of messages, while providing operations with the tools required to maintain such a system. It’s a task queue with focus on real-time processing, while also supporting task scheduling. Celery communicates via messages, usually using a broker to mediate between clients and workers. To initiate a task the client adds a message to the queue, the broker then delivers that message to a worker. Celery supports several message transport alternatives. List of supported brokers can be found [here](http://docs.celeryproject.org/en/latest/getting-started/brokers/index.html).


# Setup

To setup Celery for your project, you first need to choose a broker. For our current setup, we will be using Redis. For this, you first need to install Redis on your machine by running below command.

```bash
sudo apt-get install redis
```

Install Celery in your virtual environment by running below command and update your requirements.txt file.

```bash
pip install celery[redis]
pip freeze > requirements.txt
```

In next step, add a file `celery.py` in your project directory (with `settings.py` file). This file will look like this.

```python
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
```

You can create your tasks like this.

```python
@app.task
def add(a, b):
    print (a+b)
```
You will have to run your Worker process like this.

> $ celery -A myproject worker -l info

A task can be added in queue using `delay` function like shown below.

```python
add.delay(2, 3)
```

# Celery Beat
Celery Beat is a task scheduler which run a task periodically according to settings provided. Tasks are executed by available Worker nodes in the cluster. To add a periodic tasks for your project, just add following lines in your `celery.py` file.

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    'your_task_id': {
        'task': 'your_task',
        schedule': crontab(hour='*', minute='*/30')
    },
}
```
Run Celery Beat service like This

> $ celery -A myproject beat

Above setting will run your task after every 30 minutes. Further settings can be seen [here](http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html).

# Deployment

For the deployment, supervisor can be used to run Celery Worker and Beat services. Django app will be run in similar way as discussed in Part 1. We will be making similar supervisor configurations for Celery Worker and Beat.

## For Celery Worker

```
[program:celery_worker]
numprocs=1
command=celery -A myproject worker -l info
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600
stopsignal=QUIT
stopasgroup=true
killasgroup=true
priority=1000
```

## For Celery Beat

```
[program:celery_beat]
numprocs=1
command=celery -A myproject worker -l info
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600
stopsignal=QUIT
stopasgroup=true
killasgroup=true
priority=1001
```

One important thing is the priority of the your supervisor services. The priority of Celery Worker will be higher that Celery Beat.

# Deploy New Version

When you will add a new task or make some changes in existing tasks, you will have to restart both services. You will do this by running below commands.

```bash
sudo supervisorctl restart celery_worker
sudo supervisorctl restart celery_beat
```

# Conclusion

In this article, we added setup Celery Worker and Beat in Django app that we setup in Part 1. We used Redis server as broker for our Celery setup. Then we ran Celery Worker and Beat services using supervisor. In next article, we will discuss how we can automate this whole process using fabric script.
