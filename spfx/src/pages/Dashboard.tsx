import * as React from 'react';
import { Stack, IStackTokens, IStackStyles, Text, Card, CardItem, CardSection, CardHeader } from '@fluentui/react';

const stackTokens: IStackTokens = {
  childrenGap: 15,
  padding: 10,
};

const stackStyles: IStackStyles = {
  root: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
};

const Dashboard: React.FC = () => {
  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      <Text variant="xLarge">Financial Dashboard</Text>
      
      <Stack horizontal tokens={{ childrenGap: 20 }}>
        <Card>
          <CardHeader>
            <Text variant="large">Total Income</Text>
          </CardHeader>
          <CardSection>
            <Text variant="xLarge">$5,000</Text>
          </CardSection>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="large">Total Expenses</Text>
          </CardHeader>
          <CardSection>
            <Text variant="xLarge">$3,200</Text>
          </CardSection>
        </Card>

        <Card>
          <CardHeader>
            <Text variant="large">Net Balance</Text>
          </CardHeader>
          <CardSection>
            <Text variant="xLarge">$1,800</Text>
          </CardSection>
        </Card>
      </Stack>

      <Card>
        <CardHeader>
          <Text variant="large">Recent Activity</Text>
        </CardHeader>
        <CardSection>
          <Stack tokens={{ childrenGap: 10 }}>
            <Text>• Salary Deposit - $3,000</Text>
            <Text>• Rent Payment - $1,500</Text>
            <Text>• Groceries - $200</Text>
            <Text>• Freelance Work - $2,000</Text>
          </Stack>
        </CardSection>
      </Card>
    </Stack>
  );
};

export default Dashboard; 