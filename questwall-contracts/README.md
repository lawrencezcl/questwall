# Quest Wall 智能合约

## 目录结构

```
contracts/
├── jetton/
│   ├── JettonMaster.fc      # Jetton 主合约
│   ├── JettonWallet.fc      # Jetton 钱包合约
│   └── README.md            # Jetton 合约说明
├── nft/
│   ├── NFTCollection.fc     # NFT 集合合约
│   ├── NFTItem.fc           # NFT 项合约
│   └── README.md            # NFT 合约说明
├── tests/
│   ├── jetton-tests.fc      # Jetton 测试
│   └── nft-tests.fc         # NFT 测试
└── README.md                # 合约总体说明
```

## 合约功能概述

### Jetton 合约
- 实现代币的铸造和转账功能
- 支持批量空投
- 符合 TON 标准规范

### NFT 合约
- 实现 NFT 的铸造和转移功能
- 支持元数据存储
- 符合 TIP-4 标准规范

## 开发

### 环境要求

- TON Solidity 编译器 (func)
- TON 运行时 (fift)
- TON 区块链测试网访问权限

### 编译

```bash
# 编译 Jetton 合约
func -SPA jetton/JettonMaster.fc -o jetton/JettonMaster.fif
func -SPA jetton/JettonWallet.fc -o jetton/JettonWallet.fif

# 编译 NFT 合约
func -SPA nft/NFTCollection.fc -o nft/NFTCollection.fif
func -SPA nft/NFTItem.fc -o nft/NFTItem.fif
```

### 测试

```bash
# 运行测试
func -SPA tests/jetton-tests.fc -o tests/jetton-tests.fif
func -SPA tests/nft-tests.fc -o tests/nft-tests.fif
```

## 部署

### Jetton 部署

1. 部署 `jetton/JettonMaster.fc`
2. 合约将为每个用户自动创建 `jetton/JettonWallet.fc` 实例

### NFT 部署

1. 部署 `nft/NFTCollection.fc`
2. 合约为每个 NFT 自动创建 `nft/NFTItem.fc` 实例

## 国际化

项目支持中英文文档：
- 英文文档: [README.md](README.md)
- 中文文档: [README_zh.md](README_zh.md)

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 许可证

MIT