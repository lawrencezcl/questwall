# Quest Wall 智能合约

此目录包含 Quest Wall 的智能合约，为 TON 区块链构建。

## 合约类型

### Jetton 合约

Jetton 合约实现了 TON 的可替换代币标准。

- `JettonMaster.fc` - 主代币合约，负责铸造和管理
- `JettonWallet.fc` - 代币钱包合约，为每个用户地址创建

#### 功能特性
- 合约所有者铸造代币
- 用户之间代币转账
- 余额查询
- 批量空投支持

#### 接口
- `mint(address to_addr, int amount, address ref)` - 铸造代币
- `airdrop(address[] to_addr, int[] amount)` - 批量空投
- `getTotalSupply()` - 获取总供应量
- `getBalance(address owner)` - 获取地址余额

### NFT 合约

NFT 合约实现了 TIP-4 非可替换代币标准。

- `NFTCollection.fc` - 集合合约，负责铸造和管理
- `NFTItem.fc` - 单个 NFT 合约

#### 功能特性
- 合约所有者铸造 NFT
- 用户之间 NFT 转账
- 所有权查询
- 元数据存储

#### 接口
- `mint(address to_addr, string metadata_uri)` - 铸造 NFT
- `mint_batch(address[] to_addr, string[] meta_uri)` - 批量铸造
- `getTotalSupply()` - 获取总供应量
- `getBalance(address owner)` - 获取地址的 NFT 数量
- `transfer(address to_addr)` - 转移 NFT
- `getOwner()` - 获取 NFT 所有者
- `getMetadata()` - 获取 NFT 元数据

## 开发

### 环境要求

- TON Solidity 编译器 (func)
- TON 运行时 (fift)
- TON 区块链测试网访问权限

### 编译

```bash
# 编译 Jetton 合约
func -SPA JettonMaster.fc -o JettonMaster.fif
func -SPA JettonWallet.fc -o JettonWallet.fif

# 编译 NFT 合约
func -SPA NFTCollection.fc -o NFTCollection.fif
func -SPA NFTItem.fc -o NFTItem.fif
```

### 测试

```bash
# 运行测试
func -SPA tests/jetton-tests.fc -o jetton-tests.fif
func -SPA tests/nft-tests.fc -o nft-tests.fif
```

## 部署

### Jetton 部署

1. 部署 `JettonMaster.fc`
2. 合约将为每个用户自动创建 `JettonWallet.fc` 实例

### NFT 部署

1. 部署 `NFTCollection.fc`
2. 合约为每个 NFT 自动创建 `NFTItem.fc` 实例

## 安全性

- 所有合约都实现了标准的 TON 安全实践
- 敏感操作的所有者验证
- 输入验证和清理
- Gas 优化以提高成本效益

## 审计

在主网部署之前，合约应由专业的智能合约安全公司进行审计。

## 贡献

1. Fork 项目仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 许可证

MIT