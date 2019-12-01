---
layout: post
title:  "Part 3: Deploy Django using Nginx and Gunicorn/uWSGI - Automation with Fabric"
date:   2018-12-27
image:  
tags:   [Python, Django, Django-Deployment, Gunicorn, uWSGI, Supervisor, Fabric]
---

In part 1 of this series, we setup a Django server using uWSGI/Gunicorn and Nginx. In that part, all the steps of dependencies installation and configurations are performed one by one. The server we setup is very basic server having just application server. The database we used is Sqlite3 database. In real application, we will have PostgreSQL or MySQL which are more advance databases. Beside database and application server, we can have Celery workers or Celery Beat. For this type of servers, performing all steps one by one will be very hectic and time taking. So it is good to automate all this process using Fabric which is a high level Python (2.7, 3.4+) library designed to execute shell commands remotely over SSH, yielding useful Python objects in return. For further details, see [Fabric documentation](http://www.fabfile.org).

<!--more-->

Before we start writing fabric script, we first need to identify steps which we will be performing in order to setup a new machine and to deploy new version on server. 

**For Fresh Setup**

1. Clone latest code
2. Install required packages
3. Setup database
4. Requirement installation
5. Migrate
6. Collectstatic
7. Configure supervisor
8. Configure Nginx

**For Deploying new version**

1. Pull latest code from git repository
2. Requirement installation
3. Migrate
4. Collectstatic
5. Restart supervisor

# Fabfile Functions

Below we will be writing each functions which will be used in all above steps.

## Install required packages
As we are setting up our server on Ubuntu, we will write commands according to Ubuuntu.

```python
PACKAGE_LIST = ['git', 'supervisor', 'postgresql', 'python-pip', 'nginx'] #add all required packages in this list

def install_package():
    sudo('apt-get update')
    sudo('apt-get install %s' % (' '.join(PACKAGE_LIST)))
```

## Setup database
We will be setting up Postgresql database for this server. Below is the code to setup a Postgresql database.

```python
DB_USER = "db_user" #define your user here
DB_PASS = "db_pass" #define your password here
DB_NAME = "db_name" #define your database name here

def setup_database():
    sudo('psql -c "CREATE USER %s WITH NOCREATEDB NOCREATEUSER " \
         "ENCRYPTED PASSWORD E\'%s\'"' % (DB_USER, DB_PASS), user='postgres')
    sudo('psql -c "CREATE DATABASE %s WITH OWNER %s"' % (
         DB_NAME, DB_USER), user='postgres')

```

## Pull latest code from git repository

```python
def update_code():
    branch = local("git symbolic-ref --short -q HEAD", capture=True)
    local('git pull origin %s' % branch)
```

## Requirement installation
```python
def install_requirements():
    local('pip install -r requirements.txt')
```

## Migrate
```python
def migrate():
    local('python manage.py migrate')
```

## Collectstatic
```python
def collectstatic():
    local('python manage.py collectstatic')
```

## Configure supervisor
We will be using supervisor for running following services.
* uWSGI/Gunicorn server
* Celery worker
* Celery beat

We have seen in [Part 1](/2018/12/18/Part%201:%20Deploy-Django-using-Nginx-and-Gunicorn-uWSGI-Basic-Setup/) and [Part 2](/2018/12/25/Part-2-Deploy-Django-using-Nginx-and-Gunicorn-uWSGI-Celery-Setup/) how to write supervisor configuration file for all above services. Create a file `supervisor.conf` and add below configurations in it. 

```
;; Add one of the above uWSGI/Gunicorm
;; For gunicorn
[program:myproject_server]
numprocs=1
command=gunicorn --bind 0.0.0.0:8000 myproject.wsgi
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600
stopsignal=QUIT
stopasgroup=true
killasgroup=true
priority=999

;For uWSGI
[program:myproject_server]
numprocs=1
command=uwsgi --http :8000 --module myproject.wsgi
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600
stopsignal=QUIT
stopasgroup=true
killasgroup=true
priority=999

;;For Celery Worker**
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

;;For Celery Beat**
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

Below is the code to setup your supervisor.

```python
def configure_supervisor():
    local('supervisord -c supervisor.conf')
```

## Configure Nginx

Create a file `nginx.conf` in your project and add following configuration in it.

```
server {
    listen 80;
    server_name server_domain_or_IP;

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

Below is code to setup nginx

```python
def configure_nginx():
    sudo('ln -s nginx.conf /etc/nginx/sites-enabled/myproject.conf')
```

## Restart supervisor
```python
def restart_supervisor():
    sudo('supervisorctl restart myproject_server')
    sudo('supervisorctl restart celery_worker')
    sudo('supervisorctl restart celery_beat')
```

## Restart Nginx
```python
def restart_nginx():
    sudo('systemctl restart nginx')
```

# For Fresh Setup
```python
@task
def setup():
    install_package()
    setup_database()
    install_requirements()
    migrate()
    collectstatic()
    configure_supervisor()
    configure_nginx()
    restart_supervisor()
    restart_nginx()
```

Run below command to setup your new server.
```bash
$ fab setup
```

# For Deploying new version
```python
@task
def deploy():
    update_code()
    install_requirements()
    migrate()
    collectstatic()
    restart_supervisor()
```


Run below command to setup your new server.
```bash
$ fab deploy
```

# Conclusion

In this article, we wrote a fabric script in order to automate setup and deployment process. We divided our whole process in small steps and automated each step. By combining all these steps in required order, we automated whole proces. This can be extend to handle very complex server. Complete `fabfile` can be seen [here](https://gist.github.com/mhsiddiqui/dd129b03bd780c8dadb4b09005fb76ca).


