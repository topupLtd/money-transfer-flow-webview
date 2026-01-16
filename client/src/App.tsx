import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import SendMoney from "@/pages/send-money";
import Recipients from "@/pages/recipients";
import SourceFund from "@/pages/source-fund";
import TransferReason from "@/pages/transfer-reason";
import Preview from "@/pages/preview";
import Success from "@/pages/success";
import Transactions from "@/pages/transactions";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SendMoney} />
      <Route path="/recipients" component={Recipients} />
      <Route path="/source" component={SourceFund} />
      <Route path="/reason" component={TransferReason} />
      <Route path="/preview" component={Preview} />
      <Route path="/success" component={Success} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
