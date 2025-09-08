# Quest Wall 合约设计

## 1. Jetton（FT）合约

### 功能要求

1. **mint(to_addr, amount, ref)**
   - 铸造指定数量的代币到目标地址
   - 只能由合约所有者调用

2. **airdrop(list<to_addr, amount>)**
   - 批量空投功能
   - 支持分批处理大量地址

### 接口定义

```solidity
interface JettonMaster {
    // 铸造代币
    function mint(address to_addr, uint128 amount, address ref) external;
    
    // 批量空投
    function airdrop(address[] to_addr, uint128[] amount) external;
    
    // 获取代币总供应量
    function getTotalSupply() external view returns (uint128);
    
    // 获取用户余额
    function getBalance(address owner) external view returns (uint128);
}
```

## 2. NFT（TIP-4）合约

### 功能要求

1. **mint(to_addr, metadata_uri)**
   - 铸造单个 NFT 到目标地址
   - 支持元数据 URI

2. **mint_batch(list<to_addr, meta_uri>)**
   - 批量铸造 NFT
   - 支持不同的元数据 URI

### 接口定义

```solidity
interface NFTCollection {
    // 铸造单个 NFT
    function mint(address to_addr, string metadata_uri) external;
    
    // 批量铸造 NFT
    function mint_batch(address[] to_addr, string[] meta_uri) external;
    
    // 获取 NFT 总数
    function getTotalSupply() external view returns (uint64);
    
    // 获取用户拥有的 NFT 数量
    function getBalance(address owner) external view returns (uint64);
    
    // 获取 NFT 所有者
    function getOwner(uint64 token_id) external view returns (address);
}
```

## 3. Gas/费用优化

### 领取式分发机制

1. **生成领取凭证**
   - 后端生成离线签名的领取凭证
   - 用户通过最小 gas 交易领取

2. **批量处理**
   - 对于大规模分发，优先使用批量操作
   - 减少单次交易的 gas 消耗

### 合约设计优化

1. **存储优化**
   - 使用紧凑的数据结构
   - 避免不必要的存储操作

2. **计算优化**
   - 减少循环和递归操作
   - 使用位运算优化计算

## 4. 交易监听

### Indexer 设计

1. **事件订阅**
   - 订阅合约事件（转账、铸造等）
   - 实时回写交易状态

2. **失败重试**
   - 对失败的交易进行重试
   - 实现对账机制

### 支持的 Indexer

1. **tonapi**
   - 高性能 API 服务
   - 支持 WebSocket 订阅

2. **toncenter**
   - 社区维护的 API
   - 支持 HTTP 和 WebSocket

3. **lite-client**
   - 轻量级客户端
   - 适合自建节点