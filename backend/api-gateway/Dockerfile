FROM php:8.4-apache

# PHP and dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install zip

# MongoDB driver
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Apache mod_rewrite
RUN a2enmod rewrite

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copy files of the application
COPY . /var/www/html

# Add permissions
RUN chown -R www-data:www-data /var/www/html \
   && chmod -R 755 /var/www/html/storage \
   && chmod -R 755 /var/www/html/bootstrap/cache

# Apache vhost
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

EXPOSE 80