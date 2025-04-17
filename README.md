# webBankhoahoc

## Environment Setup

### Prerequisites
- Node.js 18+
- .NET Core 9
- Docker

### Setup Environment Variables
1. Copy .env.example to .env:
```bash
cp .env.example .env
```
2. Update .env with your values:
- Database credentials
- AWS credentials
- Payment gateway keys
- Redis & RabbitMQ settings
- JWT secrets
- Monitoring tokens

### Required Environment Variables
- `DB_CONNECTION`: Database connection type (mssql)
- `DB_HOST`: Database host
- `DB_PORT`: Database port (1433)
- `DB_DATABASE`: Database name
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password

Contact team lead for production values.
