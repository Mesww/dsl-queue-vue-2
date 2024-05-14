# Use a lightweight Node.js image
FROM node:14 as build-stage

# Set working directory
WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Vue.js application
RUN npm build

# Stage 2 - Serve the Vue.js application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the previous stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]