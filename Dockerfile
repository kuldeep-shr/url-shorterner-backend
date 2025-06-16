# Stage 1: Use the official Node.js image to build the app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to leverage Docker cache
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for building)
RUN yarn install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code
RUN yarn build

# Stage 2: Create the final, lighter-weight production image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and yarn.lock again
COPY package.json yarn.lock ./

# Install only production dependencies to keep the image small
RUN yarn install --production

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 8000

# CORRECTED: The command to start the application pointing to the right path
CMD [ "node", "dist/src/index.js" ]