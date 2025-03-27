import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IFinancialTrackerProps } from './IFinancialTrackerProps';
import { Stack, IStackTokens, IStackStyles } from '@fluentui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Dashboard from '../../pages/Dashboard';
import BudgetPlanning from '../../pages/BudgetPlanning';
import Transactions from '../../pages/Transactions';

const stackTokens: IStackTokens = {
  childrenGap: 15,
  padding: 10,
};

const stackStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%',
  },
};

export default class FinancialTrackerWebPart extends React.Component<IFinancialTrackerProps> {
  public render(): React.ReactElement<IFinancialTrackerProps> {
    return (
      <Router>
        <Stack horizontal tokens={stackTokens} styles={stackStyles}>
          <Navigation />
          <Stack.Item grow>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions context={this.props.context} />} />
              <Route path="/budget" element={<BudgetPlanning />} />
            </Routes>
          </Stack.Item>
        </Stack>
      </Router>
    );
  }
} 