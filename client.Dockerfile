# Use the official image as a parent image.
FROM nginx

# Copy the file from your host to your current location.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist-client/ /usr/share/nginx/html
