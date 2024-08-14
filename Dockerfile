# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install necessary packages
COPY package*.json ./
RUN npm install

# Copy the JavaScript file to the container
COPY convert-file.js .
COPY test-cases-output.js .
COPY syncToPostmanCloud.js .

# Specify the command to run the app
CMD ["node", "convert-file.js"]