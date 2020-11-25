# Use the official image as a parent image.
FROM node:current-slim

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY package*.json ./

# Run the command inside your image filesystem.
RUN npm ci --only=production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY dist-client/ dist-client/
COPY dist-server/ dist-server/

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 8081

# Run the specified command within the container.
CMD [ "npm", "start" ]
