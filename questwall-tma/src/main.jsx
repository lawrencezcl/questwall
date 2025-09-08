import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

// Telegram WebApp SDK
function useTelegram() {
  const [tg, setTg] = useState(null);
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const app = window.Telegram.WebApp;
      app.ready();
      setTg(app);
    }
  }, []);
  return tg;
}

// TonConnect UI
function useTonConnect() {
  const [tonConnect, setTonConnect] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  
  useEffect(() => {
    // 模拟 TonConnect 初始化
    setTonConnect({
      connected: false,
      wallet: null,
      connect: () => {
        // 模拟连接钱包
        const mockWallet = {
          address: 'EQD_example_wallet_address',
          name: 'Telegram Wallet',
        };
        setTonConnect(prev => ({ ...prev, connected: true, wallet: mockWallet }));
        setWalletAddress(mockWallet.address);
      },
      disconnect: () => {
        setTonConnect(prev => ({ ...prev, connected: false, wallet: null }));
        setWalletAddress(null);
      },
    });
  }, []);
  
  return { tonConnect, walletAddress };
}

// API 服务
const apiService = {
  // 获取任务列表
  getQuests: async () => {
    // 模拟 API 调用
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          items: [
            { 
              id: 1, 
              title: '关注频道 @your_channel', 
              reward: { type: 'stars', amount: '5' }, 
              type: 'join_channel',
              description: '关注我们的频道以获取最新动态'
            },
            { 
              id: 2, 
              title: '绑定钱包（TonConnect）', 
              reward: { type: 'jetton', amount: '10', assetAddr: 'EQ...' }, 
              type: 'wallet_bind',
              description: '连接您的 TON 钱包'
            },
            { 
              id: 3, 
              title: '完成表单问卷', 
              reward: { type: 'nft', amount: '1', assetAddr: 'EQ...' }, 
              type: 'form',
              description: '填写我们的问卷调查'
            }
          ],
          total: 3
        });
      }, 500);
    });
  },
  
  // 领取任务
  claimQuest: async (questId) => {
    // 模拟 API 调用
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `任务 ${questId} 已领取`,
          actionId: Math.floor(Math.random() * 1000)
        });
      }, 300);
    });
  },
  
  // 提交任务证明
  submitQuest: async (questId, proof) => {
    // 模拟 API 调用
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `任务 ${questId} 的证明已提交`
        });
      }, 300);
    });
  }
};

function App() {
  const tg = useTelegram();
  const { tonConnect, walletAddress } = useTonConnect();
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuest, setActiveQuest] = useState(null);

  useEffect(() => {
    if (!tg) return;
    try {
      const initDataUnsafe = tg.initDataUnsafe || {};
      setUser(initDataUnsafe.user || null);
    } catch (e) { }
  }, [tg]);

  // 获取任务列表
  useEffect(() => {
    const fetchQuests = async () => {
      setLoading(true);
      try {
        const data = await apiService.getQuests();
        setQuests(data.items);
      } catch (error) {
        console.error('获取任务列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchQuests();
    }
  }, [user]);

  const handleStartQuest = async (quest) => {
    if (quest.type === 'wallet_bind') {
      // 处理钱包绑定任务
      if (tonConnect) {
        tonConnect.connect();
      }
    } else {
      // 处理其他任务类型
      setActiveQuest(quest);
      // 领取任务
      try {
        const result = await apiService.claimQuest(quest.id);
        if (result.success) {
          alert(`任务已领取: ${result.message}`);
        }
      } catch (error) {
        console.error('领取任务失败:', error);
      }
    }
  };

  const handleSubmitQuest = async () => {
    if (!activeQuest) return;
    
    // 提交任务证明
    try {
      const result = await apiService.submitQuest(activeQuest.id, { type: 'screenshot' });
      if (result.success) {
        alert(`任务已完成: ${result.message}`);
        setActiveQuest(null);
      }
    } catch (error) {
      console.error('提交任务失败:', error);
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system,Segoe UI,Roboto,Helvetica,Arial', padding: 12 }}>
      <h2>Quest Wall · Telegram MiniApp</h2>
      <p>你好，{user ? (user.first_name + (user.last_name ? (' ' + user.last_name) : '')) : '游客'}</p>
      
      {/* 钱包连接状态 */}
      <div style={{ marginBottom: 16, padding: 10, border: '1px solid #ddd', borderRadius: 8 }}>
        <div style={{ fontWeight: '600', marginBottom: 8 }}>钱包状态</div>
        <div>地址: {walletAddress || '未连接'}</div>
        <div>状态: {tonConnect?.connected ? '已连接' : '未连接'}</div>
        <button 
          style={{ marginTop: 8, padding: '4px 8px', fontSize: 12 }}
          onClick={() => tonConnect?.connected ? tonConnect.disconnect() : tonConnect?.connect()}
        >
          {tonConnect?.connected ? '断开连接' : '连接钱包'}
        </button>
      </div>

      {/* 任务列表 */}
      <div style={{ fontWeight: '600', marginBottom: 8 }}>任务列表</div>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <ul style={{ padding: 0 }}>
          {quests.map(q => (
            <li key={q.id} style={{ margin: '8px 0', padding: '10px', border: '1px solid #ddd', borderRadius: 8, listStyle: 'none' }}>
              <div style={{ fontWeight: '600' }}>{q.title}</div>
              <div style={{ fontSize: 12, opacity: .7, margin: '4px 0' }}>{q.description}</div>
              <div style={{ fontSize: 12, opacity: .7, marginBottom: 8 }}>
                奖励：{q.reward.type === 'stars' ? '⭐' : q.reward.type === 'jetton' ? '💰' : '🏆'} {q.reward.amount} {q.reward.type}
              </div>
              <button 
                style={{ padding: '6px 12px', fontSize: 14 }}
                onClick={() => handleStartQuest(q)}
              >
                开始任务
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* 任务提交模态框 */}
      {activeQuest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            maxWidth: 400,
            width: '90%'
          }}>
            <h3>{activeQuest.title}</h3>
            <p>{activeQuest.description}</p>
            <p>请完成任务后点击下方按钮提交</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <button onClick={() => setActiveQuest(null)}>取消</button>
              <button onClick={handleSubmitQuest} style={{ backgroundColor: '#4CAF50', color: 'white' }}>提交任务</button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>Telegram initData 将在真实环境提供。</div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)