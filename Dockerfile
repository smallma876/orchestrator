# El build (pnpm build) se ejecuta antes de este paso (local o en CI).
# Esta imagen solo sirve los estáticos ya compilados.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html

EXPOSE 80
