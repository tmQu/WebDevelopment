# ADS MANAGEMENT WEBSITE

## Overview

Welcome to the Ads Management Website, a comprehensive platform designed to streamline the process of managing and optimizing advertising boards placed in Ho Chi Minh City. This README file provides essential information for users and developers to get started with the Ads Management Website.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Setup database](#setup-database)
4. [Account](#account)

## Introduction

The Ads Management Website is a user-friendly and powerful tool for managing various aspects of advertising boards. It offers a range of features to help cadres create, monitor, and optimize ads effectively.

## Setup database
Assume that the machine that host our server already have the mongodb and python intepreter.
1. **Run mongodb**

       mongod

3. **Setup database link**

   From the file db.zip, open the script.py, the default database link is ```mongodb://localhost:27017```, if the database is host on other port, change the ```new_url``` in the script.py at line 13.

       connection_url = f " new_url "

5. **Install all the necessary libraries**

        pip install pymongo

6. **Run the script**

        python script.py

## Installation

1. **Download our souce code**
2. **Install the necessary dependencies**
    
    Enter ```npm install``` in terminal.

3. **Access to web**

    Change address to **resident** or **cadre** folder and enter in terminal ```npm start```.

## Account

Login to these account for admin accessing through
http://localhost:4000/login

**Ward admin:**

    - Email: lamthanhngoc713@gmail.com
    - Password: newpass123

**District admin:**

    - Email: district@gmail.com
    - Password: newpass123

**Department admin:**

    - Email: hello9@gmail.com
    - Password: newpass123
