FROM php:8.4-apache

# Установка системных зависимостей и расширений PHP
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install zip

# Установка MongoDB драйвера
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Включение mod_rewrite для Apache
RUN a2enmod rewrite

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Копирование файлов приложения
COPY . /var/www/html

# Установка прав доступа
#RUN chown -R www-data:www-data /var/www/html \
#    && chmod -R 755 /var/www/html/storage \
#    && chmod -R 755 /var/www/html/bootstrap/cache

# Конфигурация виртуального хоста Apache
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

EXPOSE 80