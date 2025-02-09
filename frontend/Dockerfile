FROM node:alpine
 
# Set working directory
WORKDIR /app

# this will allow us to run tools directly
ENV PATH /app/node_modules/.bin:$PATH
  
# Install dependencies
COPY package*.json ./
 
# Install dependencies
RUN npm install -g @angular/cli
RUN npm install

# Copy project files
COPY . . 
 
# Expose port and start the application [dev, prod, hmr]
EXPOSE 4200 

CMD ["sh", "-c", "ng serve --host 0.0.0.0 --poll 2000 --disable-host-check"]