import * as React from 'react';
import { Stack, IStackTokens, IStackStyles, TextField, PrimaryButton } from '@fluentui/react';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

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

interface ITransactionsProps {
  context: any;
}

interface ITransactionsState {
  transactions: Array<{
    description: string;
    amount: number;
    type: string;
    date: string;
  }>;
  amount: string;
  description: string;
  type: string;
  loading: boolean;
}

const Transactions: React.FC<ITransactionsProps> = (props) => {
  const [state, setState] = React.useState<ITransactionsState>({
    transactions: [],
    amount: '',
    description: '',
    type: 'expense',
    loading: false,
  });

  const _sp: SPFI = React.useMemo(() => {
    return spfi().using(SPFx(props.context));
  }, [props.context]);

  const handleAmountChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    setState(prev => ({ ...prev, amount: newValue || '' }));
  };

  const handleDescriptionChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    setState(prev => ({ ...prev, description: newValue || '' }));
  };

  const handleTypeChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    setState(prev => ({ ...prev, type: newValue || 'expense' }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!state.amount || !state.description) {
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      await _sp.web.lists.getByTitle("FinancialTransactions").items.add({
        Title: state.description,
        Amount: parseFloat(state.amount),
        TransactionType: state.type,
        Date: new Date().toISOString(),
      });

      setState(prev => ({
        ...prev,
        amount: '',
        description: '',
        type: 'expense',
        loading: false,
      }));
    } catch (error) {
      console.error('Error adding transaction:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      <h2>Financial Tracker</h2>
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <TextField
          label="Amount"
          value={state.amount}
          onChange={handleAmountChange}
          type="number"
          required
        />
        <TextField
          label="Description"
          value={state.description}
          onChange={handleDescriptionChange}
          required
        />
        <TextField
          label="Type"
          value={state.type}
          onChange={handleTypeChange}
          required
        />
      </Stack>

      <PrimaryButton
        text="Add Transaction"
        onClick={handleSubmit}
        disabled={state.loading || !state.amount || !state.description}
      />

      <div className="transactions-list">
        <h3>Recent Transactions</h3>
        {state.transactions.map((transaction, index) => (
          <div key={index} className="transaction-item">
            <span>{transaction.description}</span>
            <span>{transaction.amount}</span>
            <span>{transaction.type}</span>
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </Stack>
  );
};

export default Transactions; 