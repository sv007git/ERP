# Variant B Production Deployment Guide
## PHP 8.2+ & MySQL / MariaDB Production Deployment

**Document:** `deployment/VARIANT_B_DEPLOYMENT.md`  
**Stack:** PHP 8.2+ Modular Monolith + MySQL 8.0+ / MariaDB 10.11+ / SQLite 3

---

## 1. System Requirements

- **Operating System**: Ubuntu 22.04 / 24.04 LTS, Debian 12, RHEL 9, or Windows Server 2022.
- **PHP Version**: 8.2, 8.3, 8.4, or 8.5.
- **PHP Extensions**: `pdo`, `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `json`, `session`.
- **Web Server**: Nginx 1.24+ or Apache 2.4+ (with `mod_rewrite`).
- **Database**: MySQL 8.0+ or MariaDB 10.11+.

---

## 2. Linux Production Setup (Nginx + PHP-FPM)

### 2.1 Install PHP & MySQL
```bash
sudo apt update && sudo apt install -y nginx mysql-server php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip
```

### 2.2 Least-Privilege Database Configuration
Log in to MySQL and create an isolated tenant database user:
```sql
CREATE DATABASE dreams_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dreams_app'@'localhost' IDENTIFIED BY 'StrongRandomPassword2026!';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER, REFERENCES ON dreams_erp.* TO 'dreams_app'@'localhost';
FLUSH PRIVILEGES;
```

### 2.3 Application Deployment
1. Clone / extract codebase to `/var/www/dreams-erp`.
2. Configure `.env`:
```ini
APP_NAME="ERP"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://erp.yourdomain.com
APP_SECRET=generate-a-64-character-random-hex-string

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dreams_erp
DB_USERNAME=dreams_app
DB_PASSWORD=StrongRandomPassword2026!

SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
```

3. Run migrations and seed data:
```bash
cd /var/www/dreams-erp/variant-b-php-mysql
php database/migrate.php
php database/seed.php
```

4. Set proper file permissions:
```bash
sudo chown -R www-data:www-data /var/www/dreams-erp
sudo chmod -R 755 /var/www/dreams-erp
sudo chmod -R 775 /var/www/dreams-erp/variant-b-php-mysql/database
```

### 2.4 Nginx Server Block (`/etc/nginx/sites-available/dreams-erp`)
```nginx
server {
    listen 80;
    server_name erp.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name erp.yourdomain.com;

    root /var/www/dreams-erp/variant-b-php-mysql/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/erp.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/erp.yourdomain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 3. Windows Server Setup (IIS + FastCGI)

1. Open **IIS Manager**, right-click **Sites -> Add Website**.
2. Set **Physical path** to: `C:\inetpub\dreams-erp\variant-b-php-mysql\public`.
3. Configure **Handler Mappings** to pass `.php` requests to `php-cgi.exe`.
4. Ensure `web.config` handles front controller rewriting:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <defaultDocument>
            <files>
                <clear />
                <add value="index.php" />
            </files>
        </defaultDocument>
        <rewrite>
            <rules>
                <rule name="ERP Front Controller" stopProcessing="true">
                    <match url="^" ignoreCase="false" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="index.php" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

---

## 4. Automated Backup Procedure

### Automated Nightly Database Dump
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/dreams-erp"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

mysqldump -u dreams_app -p'StrongRandomPassword2026!' dreams_erp | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Retain 30 days of backups
find "$BACKUP_DIR" -type f -mtime +30 -name "*.sql.gz" -delete
```
Add to crontab: `0 2 * * * /usr/local/bin/backup-erp.sh`.
