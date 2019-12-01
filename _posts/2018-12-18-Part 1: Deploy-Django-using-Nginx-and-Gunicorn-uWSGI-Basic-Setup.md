---
layout: post
title:  "Part 1: Deploy Django using Nginx and Gunicorn/uWSGI - Basic Setup"
date:   2018-12-18
image:  
tags:   [Python, Django, Django-Deployment, Gunicorn, uWSGI, Supervisor]
---

Django is a python based framework that was developed to help developer to take applications from idea to fulfillment as fast as could reasonably be expected. Django incorporates a streamlined development server for testing your code locally. But for production purpose, a more advance and secure server is required. This article will help you to setup basic server of your Django based application. We will be setting up Django server on Ubuntu 18.04 for this article.

<!--more-->

## Initial setup

For setting up server on Ubuntu, you need to install some packages which are listed below.

1. Pip
2. Python-dev
3. Nginx

To install these packages, run below commands.

**For Python-2.x**
```bash
sudo apt-get update
sudo apt-get install python-pip python-dev libpq-dev nginx
```

**For Python-3.x**
```bash
sudo apt-get update
sudo apt-get install python3-pip python3-dev libpq-dev nginx
```

These commands will install all required packages in your server and you will be ready to start your server setup.


## Setup a Python Virtual Environment

For setting up a Django application, we will have to setup a virtual environment. To do this, we first need access to the `virtualenv` command. We can install this with pip.

**For Python-2.x**
```bash
sudo -H pip install --upgrade pip
sudo -H pip install virtualenv
```
**For Python-3.x**
```bash
sudo -H pip3 install --upgrade pip
sudo -H pip3 install virtualenv
```

Now you can create a virtual environment by using below command.

```bash
mkdir myproject
virtualenv venv
```

Now activate your virtual environment by running below command.

```bash
source venv/bin/activate
```

Now install Django in this environment.

```bash
pip install Django
```

## Setup a Django Application

Since we have setup a virtual environment and installed Django in it, we can create our basic Django application. Run below command to create a basic Django application.

```bash
django-admin startproject myproject ~/myproject
```

This will create a django application in you current directory. You can run your application like by running below command.

```bash
python manage.py runserver
```

Your app will be accessible on http://127.0.0.1:8000.

## Setup Gunicorn/uWSGI

The server we run in previous step through `manage.py` command is only mean for development purpose. For production environment, you need to use other servers like Gunicorn or uWSGI. For doing this, we first need to install these packages.

**For Gunicorn**
```bash
pip install gunicorn
```

**For uWSGI**
```bash
pip install uwsgi
```

After installation of server of your choice, you need to test ability of that server to run your application. In your project directory, run following command.

**For Gunicorn**
```bash
gunicorn --bind 0.0.0.0:8000 myproject.wsgi
```

**For uWSGI**
```bash
uwsgi --http :8000 --module myproject.wsgi
```

`myproject.wsgi` in both commands refers to the `wsgi.py` file in your project directory (with settings.py). Your app will be accessible on http://127.0.0.1:8000.


## Setup Gunicorn/uWSGI Service

In previous step, we verified that our application is running correctly with Gunicorn/uWSGI. In this step, we will create a service for these server so that it keeps on running as daemon on our server. To do this, we will be using [`supervisor`](http://supervisord.org/index.html). To install `supervisor`, run following command in your virtual environment.

```bash
pip install supervisor
```

To create a supervisor service, you need to create a supervisor configuration file for your project. To create one for your project, run following command.

```bash
echo_supervisord_conf > supervisord.conf
```

This will create a sample supervisor configuration file which you can modify for your project. For our project, add one of the following according to choice of your server in your configuration file.

**For Gunicorn**
```
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
```

**For uWSGI**
```
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
```

In above configuration, you need exact path of `gunicorn` or `uwsgi` executable. If both packages are installed in virtual environment as in our case, we need to mention its path like `venv/bin/gunicorn` or `venv/bin/uwsgi`. Once you have added above configuration in `supervisord.conf` file, now you can start supervisor by running below command.

```bash
supervisord
```

For running server on startup.

```bash
cat supervisord.conf > /etc/supervisord.conf
```

This will start a supervisor service with name `myproject_server`. Your can access tour server on http://127.0.0.1:8000. If you made some changes in supervisor configuration file, run following command.

```bash
sudo supervisorctl reread
```

If you made changes in your project code, run following command.

```bash
sudo supervisorctl restart myproject_server
```

## Configure Nginx

After setting up Gunicorn/uWSGI, we need to setup Nginx to pass traffic to the process. Start by creating and opening a new server block in Nginx's sites-available directory.

```bash
sudo nano /etc/nginx/sites-available/myproject
```

Add following code in your Nginx configuration file (/etc/nginx/sites-available/myproject).

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

Save and close the file when you are finished. Now, we can enable the file by linking it to the sites-enabled directory.

```bash
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled
```

Test your Nginx configuration for syntax errors by typing below command.

```bash
sudo nginx -t
```

If no errors are reported, restart Nginx by running below command.

```bash
sudo systemctl restart nginx
```

Your application will be available on http://127.0.0.1 or http://server_domain_or_IP.


## Deploying New Version
For any deployment system, the process of deployment of new version is very important. For a good deployment process, this process should be as easy as possible. For deployment of a new version of your project for deployment system described in this article, following steps are required.

1. Get latest code from your git repository.
2. Run database migrations by running `python manage.py migrate`
3. Collect static files from multiple apps into a single path by running `python manage.py collectstatic`
4. Restart supervisor service by running `sudo supervisorctl restart myproject_server`

These steps are only applicable if you have changes in your Django application. If you have changes in your supervisor configuration, you should run `sudo supervisorctl reread`.

## Conclusion

In this article, we've set up a basic Django project in a virtual environment. We've configured Gunicorn/uWSGI to translate client requests so that Django can handle them. Afterwards, we set up Nginx to act as a reverse proxy to handle client connections and serve the correct project depending on the client request. We used supervisor in order to run service for our application server. Similar services can be written for other processes like celery worker or celery beat. The whole process can be automated using fabric script.
