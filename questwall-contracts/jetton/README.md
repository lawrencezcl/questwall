# Jetton 合约

## 功能说明

Jetton 合约实现了 TON 区块链上的可替换代币标准，支持以下功能：

1. **代币铸造** - 合约所有者可以铸造新的代币
2. **代币转账** - 用户之间可以相互转账代币
3. **余额查询** - 可以查询任意地址的代币余额
4. **批量空投** - 支持向多个地址批量发送代币

## 合约结构

### JettonMaster.fc
主合约，负责代币的铸造和管理

### JettonWallet.fc
钱包合约，每个用户地址都有对应的代币钱包合约

## 接口规范

### 主合约接口
- `mint(address to_addr, int amount, address ref)` - 铸造代币
- `airdrop(address[] to_addr, int[] amount)` - 批量空投
- `getTotalSupply()` - 获取总供应量
- `getBalance(address owner)` - 获取地址余额

### 钱包合约接口
- `transfer(int amount, address to_addr)` - 转账
- `getBalance()` - 获取余额
- `getWalletAddress(address owner)` - 获取钱包地址