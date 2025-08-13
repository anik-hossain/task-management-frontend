import { Provider } from 'react-redux';
import AppLayout from './components/layout/AppLayout'
import AppRoutes from './routes/AppRoutes'
import {store} from './store/index'
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <Provider store={store}>
    <AppLayout>
      <AuthProvider>
      <AppRoutes />
      </AuthProvider>
    </AppLayout>
    </Provider>
  )
}

export default App