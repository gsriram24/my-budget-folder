import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { pieChartColors } from "@/lib/consts";
import { Envelope } from "@/lib/types";
import { useCurrencyHelper } from "@/lib/utils";
interface Props {
  envelopeData: Envelope[];
}
function EnvelopeProgressBar({ envelopeData }: Props) {
  const { format } = useCurrencyHelper();

  return (
    <Card className="w-full pr-3">
      <CardHeader className="items-center pb-0 ">
        <CardTitle className="text-center">
          Budget consumed this month
        </CardTitle>
        <CardDescription>Amount used up in each envelope</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto mt-4  max-h-80">
        <div className="max-h-full w-full overflow-y-auto">
          {envelopeData?.map((envelope, index) => {
            const progress =
              (envelope.monthlySpend / envelope.allocated_amount) * 100;
            return (
              <div key={envelope.id} className="mb-4">
                <h3 className="text-lg font-medium">{envelope.name}</h3>
                <div className="mt-2">
                  <Progress
                    color={pieChartColors[index % pieChartColors.length]}
                    value={progress}
                  />
                  <div className="mt-1 text-sm text-gray-600">
                    {format(envelope.monthlySpend)} /{" "}
                    {format(envelope.allocated_amount)} spent
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default EnvelopeProgressBar;
