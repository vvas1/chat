## Start chat-v1 with docker-compose.yml

To start chat-v1 locally you need to create in root folder  file .env
and add to it following variables:

`PORT=<your port>` - number of the port on which server would run.\
`MONGO_URL=<your mongo connection string>` - string to connect to mongo database.\
`SALT=<secret string` - your secret string for hashing passwords.

open terminal and run `docker-compose up` or `yarn up`.\

This will build images and run containers. 

Next go to `localhost:3000` and see the chat.

## start server (without docker)

to run server uou need create in `server` folder .env file with
variables described in previous chapter.

than open terminal and run `cd server` and  `yarn dev` or if you want to run production `yarn server`\
open one more terminal and run `cd chat-client` and start server using `yarn start


### links to use:
`localhost:3000` - chat dashboard.\
`localhost:3000/register` - register user.\
`localhost:3000/login` - login user.
