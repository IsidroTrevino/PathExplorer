FROM node:18-alpine as build

WORKDIR /app
COPY pathexplorer/package*.json ./
RUN npm ci --legacy-peer-deps
COPY pathexplorer/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]