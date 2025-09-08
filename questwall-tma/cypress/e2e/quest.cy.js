// cypress/e2e/quest.cy.js
describe('Quest Flow', () => {
  beforeEach(() => {
    // Mock authentication
    cy.visit('/');
    cy.window().then((win) => {
      win.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: 123456789,
              first_name: 'Test',
              last_name: 'User'
            }
          },
          ready: () => {}
        }
      };
    });
    cy.reload();
  });

  it('should display quest list', () => {
    cy.get('li').should('have.length.greaterThan', 0);
    cy.contains('关注频道 @your_channel');
  });

  it('should start a quest', () => {
    cy.get('button').contains('开始任务').first().click();
    cy.get('button').contains('提交任务').click();
    cy.contains('任务已完成');
  });
});