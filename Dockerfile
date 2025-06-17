# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code
COPY . .

# Build TypeScript
RUN yarn build

# Expose backend port
EXPOSE 8000

# Run app
CMD ["node", "dist/src/index.js"]
