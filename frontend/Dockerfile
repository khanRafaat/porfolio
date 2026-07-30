FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# Dev default; a multi-stage production build comes with the deploy feature
CMD ["npm", "run", "dev"]
