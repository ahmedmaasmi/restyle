import { Skeleton } from "./ui/skeleton";
import {   Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from "./ui/card";
import {Item} from "../../../types";
export default function TrendingPage() {
  return (
    
    <div>
        <div><h1 className="text-3xl font-bold mb-4">Trending Items</h1></div>
        <div>
        <Card className="w-96">
        <CardHeader>
            <CardTitle>Item.name</CardTitle>
        </CardHeader>
        </Card>
        </div>

        
    </div>
  );
}