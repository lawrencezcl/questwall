# NFT 合约

## 功能说明

NFT 合约实现了 TON 区块链上的不可替换代币标准，支持以下功能：

1. **NFT 铸造** - 合约所有者可以铸造新的 NFT
2. **NFT 转移** - 用户之间可以相互转移 NFT
3. **所有权查询** - 可以查询任意 NFT 的所有者
4. **元数据存储** - 支持存储 NFT 的元数据信息

## 合约结构

### NFTCollection.fc
集合合约，负责 NFT 的铸造和管理

### NFTItem.fc
项合约，每个 NFT 都有一个独立的合约

## 接口规范

### 集合合约接口
- `mint(address to_addr, string metadata_uri)` - 铸造 NFT
- `mint_batch(address[] to_addr, string[] meta_uri)` - 批量铸造
- `getTotalSupply()` - 获取总供应量
- `getBalance(address owner)` - 获取地址拥有的 NFT 数量

### 项合约接口
- `transfer(address to_addr)` - 转移 NFT
- `getOwner()` - 获取所有者
- `getMetadata()` - 获取元数据