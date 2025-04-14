# Use Node.js as a base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Install serve globally to serve the build folder
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the built app using serve
CMD ["serve", "-s", "build", "-l", "3000"]
