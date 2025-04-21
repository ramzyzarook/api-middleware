# Use Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to install deps
COPY package*.json ./

# Install dependencies inside container
RUN npm install 

# Copy the rest of your code after installing dependencies
COPY . .

# Expose the port your server runs on
EXPOSE 3000

# Start your server
CMD ["node", "server.js"]
