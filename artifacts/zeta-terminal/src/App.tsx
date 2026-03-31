import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Terminal } from "@/pages/Terminal";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Terminal />
    </QueryClientProvider>
  );
}
