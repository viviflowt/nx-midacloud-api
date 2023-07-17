FROM nginx:latest

RUN apt-get update && \
    apt-get install -y \
    --no-install-recommends \
    dnsutils \
    htop \
    nano \
    openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy the nginx.conf file
RUN cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig

# Copy the nginx.conf file
# COPY .docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


