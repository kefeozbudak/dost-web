FROM node:22-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Cloud Run sets PORT env var, our server binds to 3000)
ENV PORT=3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
