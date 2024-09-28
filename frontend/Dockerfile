# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install --production

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application (if using TypeScript)
RUN npm run build

# Step 7: Expose the port the app runs on (e.g., 3000)
EXPOSE 3000

# Step 8: Define the command to run the application
CMD ["npm", "run", "start"]
