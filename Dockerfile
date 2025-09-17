FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Expose Expo ports (Metro bundler, debugger, dev tools)
EXPOSE 19000 19001 19002

CMD ["npm", "start"]
