// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {
  it('should authenticate with Telegram initData', () => {
    cy.visit('/');
    
    // Mock Telegram WebApp
    cy.window().then((win) => {
      win.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: 123456789,
              first_name: 'Test',
              last_name: 'User',
              username: 'testuser'
            }
          },
          ready: () => {}
        }
      };
    });

    cy.reload();
    cy.contains('你好，Test User');
  });
});