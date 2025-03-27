import * as React from 'react';
import { Stack, IStackTokens, IStackStyles, Text, TextField, PrimaryButton, Slider, ProgressIndicator } from '@fluentui/react';

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

const BudgetPlanning: React.FC = () => {
  const [monthlyBudget, setMonthlyBudget] = React.useState<string>('5000');

  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      <Text variant="xLarge">Budget Planning</Text>

      <Stack tokens={{ childrenGap: 20 }}>
        <Stack>
          <Text variant="large">Monthly Budget</Text>
          <TextField
            label="Total Budget"
            value={monthlyBudget}
            onChange={(_, newValue) => setMonthlyBudget(newValue || '')}
            prefix="$"
          />
        </Stack>

        <Stack>
          <Text variant="large">Budget Allocation</Text>
          <Stack tokens={{ childrenGap: 15 }}>
            <Stack>
              <Text>Housing (40%)</Text>
              <ProgressIndicator percentComplete={0.4} />
            </Stack>
            <Stack>
              <Text>Food (20%)</Text>
              <ProgressIndicator percentComplete={0.2} />
            </Stack>
            <Stack>
              <Text>Transportation (15%)</Text>
              <ProgressIndicator percentComplete={0.15} />
            </Stack>
            <Stack>
              <Text>Entertainment (10%)</Text>
              <ProgressIndicator percentComplete={0.1} />
            </Stack>
            <Stack>
              <Text>Savings (15%)</Text>
              <ProgressIndicator percentComplete={0.15} />
            </Stack>
          </Stack>
        </Stack>

        <Stack>
          <Text variant="large">Budget Adjustments</Text>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Slider
              label="Housing"
              min={0}
              max={100}
              step={1}
              value={40}
              showValue
            />
            <Slider
              label="Food"
              min={0}
              max={100}
              step={1}
              value={20}
              showValue
            />
            <Slider
              label="Transportation"
              min={0}
              max={100}
              step={1}
              value={15}
              showValue
            />
          </Stack>
        </Stack>

        <PrimaryButton text="Save Budget Plan" />
      </Stack>
    </Stack>
  );
};

export default BudgetPlanning; 