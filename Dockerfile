# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the application code
COPY . .

# Install Node.js dependencies
RUN yarn install

# Build the React app
RUN yarn build

# Expose 'web' frontend
EXPOSE 3000

# Expose 'server' backend
EXPOSE 4000

# Define the command to run your application
CMD ["yarn", "start"]
