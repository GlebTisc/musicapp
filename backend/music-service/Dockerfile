FROM php:8.4-apache

# install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libcurl4-openssl-dev \
    libzip-dev \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install zip

# install MongoDb
RUN curl -fsSL https://github.com/mongodb/mongo-php-driver/releases/download/1.21.0/mongodb-1.21.0.tgz | tar xvz -C /tmp \
    && cd /tmp/mongodb-1.21.0 \
    && phpize \
    && ./configure \
    && make -j$(nproc) \
    && make install \
    && docker-php-ext-enable mongodb \
    && cd / \
    && rm -rf /tmp/mongodb-1.21.0

# enable mod_rewrite for Apache
RUN a2enmod rewrite

# install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copy application files
COPY . /var/www/html

# configure Apache vhost
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

EXPOSE 80