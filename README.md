# connection

Shipyard Microservice

---

## Environment variables

| Name                  | Type     | Default | Description                       |
| --------------------- | -------- | ------- | --------------------------------- |
| **SERVICE_PORT:**     | `Number` | 3069    | Microservice port.                |
| **DATABASE_URL:**     | `String` |         | Database url.                     |

## API

| Type | URL             | Body                                        | Query               | Response              | Description                                             |
| ---- | ----------------| ------------------------------------------- | ------------------- | --------------------- | ------------------------------------------------------- |
| GET  | `/api/status`   |                                             |                     | **online**: `boolean` | Testing service connection.                             |

## Usage

**LOCAL**: create a `.env` file, with the specified variables and run `docker-compose up -d --build`.

## License

This project is released under the [Apache version 2](LICENSE) license.

