import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import SendMoney from "@/pages/send-money";
import SelectRecipient from "@/pages/select-recipient";
import Recipients from "@/pages/recipients";
import RecipientDetail from "@/pages/recipient-detail";
import SourceFund from "@/pages/source-fund";
import TransferReason from "@/pages/transfer-reason";
import Preview from "@/pages/preview";
import Success from "@/pages/success";
import Transactions from "@/pages/transactions";
import TransactionDetail from "@/pages/transaction-detail";
import Profile from "@/pages/profile";
import ProfileDetails from "@/pages/profile-details";
import EditProfile from "@/pages/edit-profile";
import TransferLimits from "@/pages/transfer-limits";
import Promotions from "@/pages/promotions";
import PromoDetail from "@/pages/promo-detail";
import AddRecipient from "@/pages/add-recipient";
import NewRecipient from "@/pages/new-recipient";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SendMoney} />
      <Route path="/select-recipient" component={SelectRecipient} />
      <Route path="/add-recipient" component={AddRecipient} />
      <Route path="/new-recipient" component={NewRecipient} />
      <Route path="/recipients" component={Recipients} />
      <Route path="/recipients/:id" component={RecipientDetail} />
      <Route path="/source" component={SourceFund} />
      <Route path="/reason" component={TransferReason} />
      <Route path="/preview" component={Preview} />
      <Route path="/success" component={Success} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/transactions/:id" component={TransactionDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile-details" component={ProfileDetails} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/transfer-limits" component={TransferLimits} />
      <Route path="/promotions" component={Promotions} />
      <Route path="/promotions/:id" component={PromoDetail} />
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
