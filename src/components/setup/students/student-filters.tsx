"use client";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/shadcn/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { ListFilterIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { studentFilterParsers } from "@/features/students/student.cache";
import { genderSelectOptions } from "@/lib/select-options";
import { getHtmlDateString } from "@/lib/utils";

const genderFilterOptions = [...genderSelectOptions, { value: "all", label: "All" }];

export default function StudentFilters() {
  const [{ gender, dobFrom, dobTo }, setParsers] = useQueryStates(studentFilterParsers);

  const isFilterActive = gender !== "all" || (!!dobFrom && !!dobTo);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant={isFilterActive ? "default" : "outline"} className="shrink-0">
            <ListFilterIcon />
            Filters
          </Button>
        }
      />
      <PopoverContent align="end">
        <PopoverHeader>
          <PopoverTitle>Filter students</PopoverTitle>
        </PopoverHeader>
        <FieldGroup>
          <FieldGroup>
            <FieldLabel className="-mb-3">Date of birth</FieldLabel>
            <Field>
              <FieldLabel className="text-muted-foreground">From</FieldLabel>
              <Input
                type="date"
                value={getHtmlDateString(dobFrom ?? new Date())}
                onChange={(e) => setParsers({ dobFrom: e.target.value ? new Date(e.target.value) : null })}
              />
            </Field>
            <Field>
              <FieldLabel className="text-muted-foreground">To</FieldLabel>
              <Input
                type="date"
                value={getHtmlDateString(dobTo ?? new Date())}
                onChange={(e) => setParsers({ dobTo: e.target.value ? new Date(e.target.value) : null })}
              />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Gender</FieldLabel>
            <Select items={genderFilterOptions} value={gender} onValueChange={(value) => setParsers({ gender: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genderFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {isFilterActive && (
            <Field>
              <Button onClick={() => setParsers({ gender: "all", dobFrom: null, dobTo: null })}>Clear Filters</Button>
            </Field>
          )}
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}
