import { type HttpError, useBack, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ChevronsUpDown, Check } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { cn } from "@/lib/utils";
import type { Timecard, Contractor, PurchaseOrder } from "@/types";

const timecardFormSchema = z.object({
  contractorId: z.number({ required_error: "Contractor is required" }),
  purchaseOrderId: z.number({ required_error: "Purchase Order is required" }),
  date: z.string().min(1, "Date is required"),
  hours: z.number().min(0.5, "Hours must be at least 0.5").max(24, "Hours cannot exceed 24"),
  taskDescription: z.string().min(10, "Task description must be at least 10 characters"),
});

type TimecardFormValues = z.infer<typeof timecardFormSchema>;

export function CreateTimecardPage() {
  const back = useBack();

  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<Timecard, HttpError, TimecardFormValues>({
    resolver: zodResolver(timecardFormSchema),
    defaultValues: {
      contractorId: undefined,
      purchaseOrderId: undefined,
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      taskDescription: "",
    },
    refineCoreProps: {
      resource: "timecards",
      action: "create",
      redirect: "list",
    },
  });

  // Fetch contractors for selection
  const { options: contractorOptions, queryResult: contractorsQuery } = useSelect<Contractor>({
    resource: "contractors",
    optionValue: "id",
    optionLabel: (item: Contractor) => `${item.firstName} ${item.lastName}`,
  });

  // Fetch purchase orders for selection
  const { options: poOptions, queryResult: poQuery } = useSelect<PurchaseOrder>({
    resource: "purchase_orders",
    optionValue: "id",
    optionLabel: "poNumber",
  });

  function onSubmit(values: TimecardFormValues) {
    // Get contractor pay rate
    const contractor = contractorsQuery.data?.data?.find((c: Contractor) => c.id === values.contractorId);
    const hourlyRate = contractor?.payRate || 100;

    // Calculate total amount
    const totalAmount = values.hours * hourlyRate;

    // Create timecard with calculated fields
    const timecardData = {
      ...values,
      status: "Pending" as const,
      submittedDate: new Date().toISOString().split("T")[0],
      hourlyRate,
      totalAmount,
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
    };

    onFinish(timecardData as any);
  }

  return (
    <CreateView>
      <CreateViewHeader title="Submit Timecard" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <FormField
            control={form.control}
            name="contractorId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Contractor</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        type="button"
                        disabled={contractorsQuery.isLoading}>
                        {field.value
                          ? contractorOptions?.find((option: any) => option.value === field.value)?.label
                          : "Select contractor..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search contractor..." />
                      <CommandList>
                        <CommandEmpty>No contractor found.</CommandEmpty>
                        <CommandGroup>
                          {contractorOptions?.map((option: any) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() => {
                                form.setValue("contractorId", option.value as number);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  option.value === field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseOrderId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Purchase Order</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        type="button"
                        disabled={poQuery.isLoading}>
                        {field.value
                          ? poOptions?.find((option: any) => option.value === field.value)?.label
                          : "Select purchase order..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search PO..." />
                      <CommandList>
                        <CommandEmpty>No purchase order found.</CommandEmpty>
                        <CommandGroup>
                          {poOptions?.map((option: any) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() => {
                                form.setValue("purchaseOrderId", option.value as number);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  option.value === field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours Worked</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Enter hours in 0.5 increments (e.g., 8 or 8.5)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the work performed..." className="resize-none" rows={4} {...field} />
                </FormControl>
                <FormDescription>Provide detailed description of tasks completed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => back()} disabled={formLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Timecard
            </Button>
          </div>
        </form>
      </Form>
    </CreateView>
  );
}
