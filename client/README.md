# Quality check for bookings

This client will show a table as requested in the root repo.

## Running the client
To start the application with default configuration simply run 
```
$ docker-compose build
$ docker-compose up
```
This will load the client querying the API in ```http://localhost:9292```, in case you want to use a different URL you can specify it either by running
```docker-compose build --build-arg APIURL=http://your-api-server-url/``` or if you prefer you can specify it in ```docker-compose.yaml``` modifying the value of ```APIURL```
```
services:
  client-web:
    build:
      context: .
      args:
        APIURL: http://localhost:9292
```

Application will be available in port 80

## Decisions taken
The decision of implementing this exercise in JavaScript might sound even reasonable:
* The result should be a table, while it's possible to create a table in any language, web oriented ones make it simpler 
(simply running ```ng new client``` gives you a working SPA)
* First requirement involved working with regular expressions: this is one of JAvaScript and Python's strongest points (Python was another option to build this)
* All the boilerplate code to create a web, routes, etc. is already provided by NG
* JS code is crystal-clear, really easy to understand
* I truly love Javascript's spread (```...```) operator
* Last but most important, I wanted to learn something I'm not familiar with, doing this as a Java - Spring boot project would have been boring

There are some backoffs that I've learned through this development, and that clearly point that using node + NG here wasn't the most clever choice:
* NG gives you a environment based configuration, in order to set up properties depending on the environment, but it needs to be done at build time, you can simply run 
a ```ng build prod``` command and you'll have your production-ready code. This is 'nice', but would be coooler if it allowed you to use environment variablles so you 
could simply accomplish the "build one deploy many" principle.
* The only thing heavier than anti-matter is ```node_modules ``` folder. It has an advantage, as it creates an SPA that can run in a simple nginx image, but gives you more work. In order to build a simple project with almost no dependencies you need to download ~200 Mb in dependecies.
* Node's community is great, they provide libraries for aboslutely everything, but security problems appear every now and then (you'll see them when building the image)

## Implementation
### Code itself
All the logic is set in ```quality-gate.component.ts```, basically:
* ```quality-gate.component.ts``` contains all the logic (sorry if the regular expression is too long, didn't have time to review it)
* ```bookings.service.ts``` is a simple injectable service that queries the API
* ```model``` folder contains simple TypeScript interfaces to handle API's responses
### You build it, you run it part
There was an important decision to make when building the runnable image: node is really big (well, not as big a java, but bigger than needed), so I took what I still consider
as a good decision: use 2 images, one for the build and another one for running the SPA.

This reduced the image size from 542 Mb to 26.1 Mb, sounds good.

Therefore, if you look at the ```Dockerfile``` you'll notice there's a node image at the beggining, that downloads all the modules and depdencies (you'll see some failing optional modules and several vulnerabilities there while building, sorry, had no time to upgrade them, but ```npm audit fix``` solves them), creates a distributable image (simply a set of html + .js files) and then creates a simple image using nginx as a base and serves the SPA.

As everybody, I found the CORS problem, security is needed but always a pain... Luckily, nginx can act as a proxy with a simple configuration addition, so it allowed me to solve that problem easily. The application always looks for the API in ```http://localhost/bookings``` and nginx does all the needed redirections, so with this we also solve angular's problem with environments.

The only bad part of using this nginx image is that it doesn't allow environment variables in configuration files, so I had to write a small hack to replace the API base URL
when building the image (you'll notice there's a small ```sed``` command).

That's all, thanks for reading all this

P.S.: I really enjoyed this :)