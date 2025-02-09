FROM node:alpine

# Set working directory
WORKDIR /app

# this will allow us to run tools directly
ENV PATH /app/node_modules/.bin:$PATH
  
# Install dependencies
COPY package*.json ./
 
# Install dependencies 
RUN npm install --verbose sharp

# Uncomment the following lines if you are having issues with Prisma
# RUN npm install -g @prisma/engines@6.3.1
# RUN cp /usr/local/lib/node_modules/@prisma/engines/libquery_engine-*.so.node /app/node_modules/@prisma/engines/

# Copy project files
COPY . . 
 

# Expose port and start the application [dev, prod, hmr]
EXPOSE 8000 

CMD ["sh", "-c", "until nc -z postgres 5432; do echo 'Waiting for Postgres...'; sleep 1; done; npm run resetdb; npm run seeddb; npm run dev"]