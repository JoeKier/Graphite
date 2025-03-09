# Use Node.js as a base image
FROM node:16

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the application
COPY . /app/

# Build the React app
RUN npm run build

# Expose the port React app will run on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
