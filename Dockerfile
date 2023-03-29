FROM node:16-buster-slim

ARG GITHUB_TOKEN

# Update everything on the box
RUN apt-get -y update
RUN apt-get clean
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

RUN apt-get -y update
RUN apt-get -y install git openssh-client
# global install pm2
RUN npm install pm2 -g

WORKDIR /usr/src/app

COPY package*.json ./

RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"

RUN npm install

# remove the secret token from the git config file, remember to use --squash option for docker build, when it becomes available in docker 1.13
RUN git config --global --unset url."https://${GITHUB_TOKEN}@github.com/".insteadOf

COPY . .

EXPOSE 4000

CMD ["npm", "start"]