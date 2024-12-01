# Front-end for exchange

1. Setting up order table + submit/cancel order buttons: Done
2. Show graphs of PnL of user: Only have balance - TBC
3. Show graphs of PnL of bots: TBC
4. Host the front-end on GithubPages/Vercel: Cancelled - host it on the same server

Since https doesn't allow request to http or ws (since not secured), we need to host on the Oracle server
(Apache web server) to allow http.

### SET UP STEPS:
1. Open Oracle port 80 by going to the Virtual Cloud Network (not the Computing Instance) -> Security List -> Add Ingress rule for port 80 (TCP Protocol)

2. Set up apache server:
https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-22-04#step-6-getting-familiar-with-important-apache-files-and-directories
```
sudo apt install apache2
```

3. Adjust utf firewall if any

4. Check status: sudo systemctl status apache2

5. Set up virtual host (to encapsulate conf details and host multiple domain):

6. Create your domain dir: sudo mkdir /var/www/your_domain

7. Assign ownership to yourself: sudo chown -R $USER:$USER /var/www/your_domain

8. Add an index.html in: /var/www/your_domain/index.html

9. Create a virtual host file: sudo nano /etc/apache2/sites-available/your_domain.conf

```
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName your_domain
    ServerAlias www.your_domain
    DocumentRoot /var/www/your_domain
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

10. Enable the site: sudo a2ensite your_domain.conf

11. Disable the default one: sudo a2dissite 000-default.conf

12. Test the configuration: sudo apache2ctl configtest

Reload for all changes to take effect: sudo systemctl restart apache2

After that, the site will be served as default: http://<server_IP_address> or at http://your_domain if the domain is set up.
