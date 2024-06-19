import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PublicClientApplication, EventMessage, AuthenticationResult, EventType } from '@azure/msal-browser';
import { msalConfig } from './authConfig'; 
import { store } from './app/store'
import { Provider } from 'react-redux'
import User from './features/user/User.tsx';
import { QueryClientProvider,QueryClient } from '@tanstack/react-query';
import Table from './components/ProductTable.tsx';
import { makeData } from './makeData.ts';
import { columns, renderSubComponent } from './components/ProductTableHelper.tsx';

export const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();
// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

const data = makeData(10);

msalInstance.addEventCallback((event: EventMessage) => {
  if ((event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          event.eventType === EventType.SSO_SILENT_SUCCESS) && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <User msalInstance={msalInstance} />
        <App />
        <Table
        data={data}
        columns={columns}
        getRowCanExpand={() => true}
        renderSubComponent={renderSubComponent}
      />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)