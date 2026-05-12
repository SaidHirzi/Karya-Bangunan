import StatCards from "@/app/src/component/statcards/StatCards";
import RecentSales from "@/app/src/component/recentsales/RecentSales";
import FinancialActivity from "@/app/src/component/financialactivity/FinancialActivity";

export default function Home() {
  return (
    <div className="p-8">
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentSales />
        <FinancialActivity />
      </div>
    </div>
  );
}
