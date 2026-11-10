"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/shadcn/chart";
import type { IExamByEnrollmentId } from "@/features/exams";

const chartConfig = {
  marks: { label: "Student mark", color: "var(--chart-1)" },
  absenceMarker: { label: "A/B", color: "var(--destructive)" },
} satisfies ChartConfig;

function AbsenceDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="var(--background)" stroke="var(--color-absenceMarker)" strokeWidth={2} />
      <text x={cx} y={cy + 3} textAnchor="middle" fill="var(--color-absenceMarker)" fontSize={8} fontWeight={700}>
        A/B
      </text>
    </g>
  );
}

export function StudentSubjectProgressChart({
  subjectId,
  subjectName,
  examData,
}: {
  subjectId: string;
  subjectName: string;
  examData: IExamByEnrollmentId[];
}) {
  const data = examData.map((exam) => {
    const subject = exam.subjects.find((item) => item.id === subjectId);
    const hasMark = subject?.result.status === "present" && subject.result.marks !== null;

    return {
      exam: exam.name,
      mark: hasMark ? subject.result.marks : null,
      absenceMarker: hasMark ? null : -10,
      absenceDescription: subject?.result.status === "absent" ? "Absent" : "No mark recorded",
    };
  });
  const hasMarks = data.some((item) => item.mark !== null);

  if (!data.length) {
    return (
      <p className="mb-4 rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        No exam results are available for {subjectName}.
      </p>
    );
  }

  return (
    <div className="mb-4 space-y-2">
      {!hasMarks && (
        <p className="text-sm text-center text-muted-foreground py-5">
          No marks recorded. &apos;-&apos; markers indicate absent or unrecorded results
        </p>
      )}
      {hasMarks && (
        <div className="overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-85 min-w-140 w-full aspect-auto"
            aria-label={`${subjectName} marks across exams`}
          >
            <AreaChart data={data} margin={{ top: 12, right: 20, bottom: 12, left: 8 }} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="exam"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={64}
              />
              <YAxis
                domain={[-18, 100]}
                ticks={[-10, 0, 20, 40, 60, 80, 100]}
                tickFormatter={(value: number) => (value === -10 ? "A/B" : String(value))}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDataOverflow
              />
              <ReferenceLine y={0} stroke="var(--border)" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => label}
                    formatter={(value, _name, item) => (
                      <div className="flex items-center justify-between gap-4">
                        {item.dataKey === "absenceMarker" ? (
                          <>
                            <span className="text-muted-foreground">{item.payload.absenceDescription}</span>
                            <span className="font-medium">Absent</span>
                          </>
                        ) : (
                          <>
                            <span className="text-muted-foreground">Student mark</span>
                            <span className="font-mono font-medium tabular-nums">{value} / 100</span>
                          </>
                        )}
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="mark"
                name="Student mark"
                stroke="var(--color-marks)"
                strokeWidth={2}
                fill="var(--color-marks)"
                fillOpacity={0.2}
                connectNulls
                dot={{ r: 4, fill: "var(--color-marks)" }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="linear"
                dataKey="absenceMarker"
                name="A/B"
                stroke="transparent"
                fill="transparent"
                activeDot={false}
                dot={<AbsenceDot />}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
}
