import { expect, test } from '@playwright/test';

test('intentional failure: checkout decline copy stays helpful', async () => {
  test.skip(!process.env.RUN_INTENTIONAL_FAILURE, 'Run with npm run test:intentional-failure for TestRelic failure evidence.');

  const actualMessage = 'Something went wrong';

  expect(actualMessage).toBe('Try another card');
});
