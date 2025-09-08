# Quest Wall

Quest Wall is a Telegram MiniApp-based task wall system that allows users to complete various tasks and earn rewards. The system supports multiple task types, including social tasks (following channels, joining groups), on-chain tasks (token transfers, NFT minting), and more.

## Features

- **Telegram Authentication**: Secure authentication using Telegram WebApp initData
- **Task System**: Support for multiple task types and reward mechanisms
- **Wallet Integration**: Integration with multiple TON wallets via TonConnect
- **Reward Distribution**: Support for Stars, Jetton, and NFT rewards
- **Ad Integration**: Integration with Adsgram advertising network
- **Risk Control System**: Multi-layer risk control and anti-cheat mechanisms
- **Data Analytics**: Real-time monitoring and analytics dashboard

## Tech Stack

### Frontend
- React 18
- Telegram WebApp SDK
- TonConnect UI
- Vite build tool

### Backend
- NestJS (Node.js)
- PostgreSQL
- Redis
- ClickHouse
- JWT Authentication

### Blockchain
- TON Blockchain
- FunC Smart Contracts
- TonConnect Wallet Integration

### Infrastructure
- Docker containerization
- Kubernetes orchestration
- GitHub Actions CI/CD
- Prometheus + Grafana monitoring

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+
- ClickHouse 23+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd questwall
```

2. **Install frontend dependencies**
```bash
cd questwall-tma
npm install
```

3. **Install backend dependencies**
```bash
cd ../questwall-backend
npm install
```

4. **Start development environment**
```bash
# Start databases and other services
cd ..
docker-compose up -d

# Start backend service
cd questwall-backend
npm run start:dev

# Start frontend service
cd ../questwall-tma
npm run dev
```

## Project Structure

```
questwall/
├── questwall-tma/              # Telegram MiniApp frontend
├── questwall-backend/          # Backend service
├── questwall-contracts/        # Smart contracts
├── docker-compose.yml          # Docker orchestration
└── README.md                   # Project documentation
```

## API Documentation

The API follows RESTful design principles. Key endpoints include:

- `POST /auth/telegram` - Telegram authentication
- `GET /quests` - Get task list
- `POST /quests/:id/claim` - Claim a task
- `POST /quests/:id/submit` - Submit task proof
- `POST /quests/:id/reward` - Distribute rewards
- `POST /wallet/connect/start` - Start wallet connection
- `POST /wallet/tx/prepare` - Prepare transaction
- `POST /wallet/tx/confirm` - Confirm transaction
- `GET /wallet/tx/:id` - Get transaction status

## Database Design

### PostgreSQL (Transactional Database)
- `users` - User information
- `quests` - Task information
- `actions` - User task actions
- `rewards` - Reward records
- `payouts` - Withdrawal records

### ClickHouse (Analytics Database)
- `events` - User events
- `ad_impressions` - Ad impressions
- `anti_fraud` - Anti-fraud records

## Smart Contracts

### Jetton Contracts
- `JettonMaster.fc` - Main token contract
- `JettonWallet.fc` - Token wallet contract

### NFT Contracts
- `NFTCollection.fc` - NFT collection contract
- `NFTItem.fc` - Individual NFT contract

## Deployment

The project supports containerized deployment using Docker and Kubernetes. See `docker-compose.yml` for local deployment and Kubernetes manifests in the `k8s/` directory for production deployment.

## Testing

The project includes unit tests, integration tests, and end-to-end tests. Run tests with:

```bash
# Backend tests
cd questwall-backend
npm run test

# Frontend tests
cd ../questwall-tma
npm run test
```

## Documentation

Complete documentation is available in the following files:

- [Project Documentation](DOCS.md) - Complete project documentation
- [Frontend Guide](questwall-tma/README.md) - Frontend development guide
- [Backend Guide](questwall-backend/README.md) - Backend development guide
- [Smart Contracts](questwall-contracts/README.md) - Smart contract development guide
- [API Specification](questwall-api.yaml) - Complete API specification

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please contact us through:
- GitHub Issues
- Email: support@questwall.com
- Telegram group