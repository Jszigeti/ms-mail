# Mail Microservice (ms-mail)

This repository contains a fully functional mail microservice built with **NestJS**, **MongoDB**, and **NATS** for message-based communication. The service is designed to send emails using customizable templates and log the status of each email for monitoring and debugging.

---

## Features

- **Email Sending**: Send emails with configurable templates and dynamic variables.
- **Template Management**: Store and retrieve email templates for consistent messaging.
- **Message Broker Integration**: Connects to any NATS-compatible system for seamless communication.
- **Logging**: Tracks the status of emails (e.g., `PENDING`, `SENT`, `FAILED`) for monitoring purposes.
- **Authentication & Security**: Secure inter-node communication using MongoDB replica sets with `keyFile` authentication.
- **Extensibility**: Easily integrate into existing systems via NATS messaging.

---

## Requirements

- **Node.js**
- **MongoDB**
- **NATS**
- **Docker** (optional, for containerized deployment)

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Jszigeti/ms-mail.git
cd ms-mail
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=mongodb://<username>:<password>@<host>:27017/<database>
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password
NATS_URL=nats://<host>:4222
```

---

## Usage

### Starting the Microservice

To start the service in development mode:

```bash
npm run start:dev
```

For production:

```bash
npm run start:prod
```

### NATS Communication

This microservice listens for messages on the `SEND_MAIL` subject. To send an email, publish a message with the following structure:

```json
{
  "userId": "123456",
  "templateId": "example",
  "variables": {
    "to": "john.doe@example.com",
    "subject": "Welcome to Our Service",
    "name": "John Doe"
  }
}
```

#### Example with NATS CLI:

```bash
nats pub SEND_MAIL '{
  "userId": "123456",
  "templateId": "example",
  "variables": {
    "to": "john.doe@example.com",
    "subject": "Welcome to Our Service",
    "name": "John Doe"
  }
}'
```

---

## Email Templates

### Directory Structure

Templates are stored in the `templates/` directory and must be in `.html` format.

#### Example Template (`example.html`):

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome</title>
  </head>
  <body>
    <h1>Welcome, {{name}}!</h1>
    <p>We are excited to have you join our service.</p>
  </body>
</html>
```

### Variable Replacement

The `variables` object in the NATS message replaces placeholders in the template using the `{{key}}` syntax.

---

## Logs

### MongoDB Email Logs

Each email sent is logged in the MongoDB `emailLog` collection with the following structure:

```json
{
  "_id": "<log_id>",
  "templateId": "example",
  "userId": "123456",
  "status": "SENT",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:10.000Z"
}
```

### Statuses

- **PENDING**: Email is being processed.
- **SENT**: Email was successfully sent.
- **FAILED**: Email could not be sent.

---

## Development

### Codebase Structure

```plaintext
prisma/                     # Prisma schema and client
src/
├── mail/                   # Mail service module
│   ├── mail.controller.ts  # Handles NATS messages
│   ├── mail.service.ts     # Business logic for sending emails
│   └── templates/          # Email templates
├── prisma/                 # Prisma service module
│   └── prisma.service.ts   # Prisma service
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
└── templates               # Templates folder
```

### Running in Development

```bash
npm run start:dev
```

---

## Deployment

### Docker Deployment

#### Build and Run the Docker Image

1. Build the Docker image:

   ```bash
   docker build -t ms-mail .
   ```

2. Run the container:
   ```bash
   docker run -d \
     -p 3000:3000 \
     --name ms-mail \
     --env-file .env \
     ms-mail
   ```

### Kubernetes Deployment

Create a `Deployment` and `Service` manifest for your Kubernetes cluster to deploy the service.

---

## Troubleshooting

### Common Issues

1. **Replica Set Not Initialized**:
   Ensure MongoDB is running with `--replSet rs0` and initialized using:

   ```javascript
   rs.initiate();
   ```

2. **Email Not Sent**:
   Check the logs in MongoDB and confirm your SMTP credentials are correct.

3. **NATS Connection Error**:
   Ensure your NATS server is running and accessible at the `NATS_URL` provided in the `.env` file.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

This project is **UNLICENSED** and provided as an example. Feel free to adapt it to your needs.

---

## Contact

- Author: Jonas Szigeti
- GitHub: [https://github.com/Jszigeti](https://github.com/Jszigeti)
- Issues: [Open an issue](https://github.com/Jszigeti/react-message/issues)
