import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from 'sonner';
import App from './App';


// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
