import { Provider } from "react-redux";
import { store } from "./store/index";
import { AuthProvider } from "./hooks/useAuth";
import { Suspense, lazy } from "react";

// Lazy load heavy components
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const AppRoutes = lazy(() => import("./routes/AppRoutes"));

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Suspense fallback={null}>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </Suspense>
      </AuthProvider>
    </Provider>
  );
}

export default App;
