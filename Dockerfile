FROM python:3.12-slim

WORKDIR /usr/src/app
COPY . .

EXPOSE 9999
CMD ["python", "-m", "http.server", "9999", "--directory", "."]
