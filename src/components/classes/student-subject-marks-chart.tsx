"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/shadcn/chart";
import type { IExamByEnrollmentId } from "@/features/exams";

const chartConfig = {
  marks: { label: "Student mark", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function StudentSubjectMarksChart({
  subjects,
  examName,
}: {
  subjects: IExamByEnrollmentId["subjects"];
  examName: string;
}) {
  const data = subjects.map((subject) => ({
    subject: subject.name,
    marks: subject.result.status === "present" ? subject.result.marks : null,
    status: subject.result.status === "present" ? "Present" : "Absent",
  }));
  const hasMarks = data.some((subject) => subject.marks !== null);

  if (!hasMarks) {
    return (
      <p className="mb-4 rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        No marks recorded for {examName}. Absent or unrecorded results are shown as &apos;-&apos; in the table.
      </p>
    );
  }

  return (
    <div className="mb-4 space-y-2">
      <ChartContainer
        config={chartConfig}
        className="w-full aspect-auto"
        style={{ height: Math.max(220, data.length * 44 + 40) }}
        aria-label={`${examName} subject marks`}
      >
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, bottom: 8, left: 8 }} accessibilityLayer>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
          />
          <YAxis type="category" dataKey="subject" width={140} tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">{item.payload.status}</span>
                    <span className="font-mono font-medium tabular-nums">{value} / 100</span>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="marks" fill="var(--color-marks)" radius={[0, 4, 4, 0]} maxBarSize={28} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
