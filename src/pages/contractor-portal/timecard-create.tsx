import { useForm } from "@refinedev/react-hook-form";
import { useSelect, useGetIdentity, type HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { useNavigate } from "react-router";
import type { Timecard, PurchaseOrder } from "@/types";

const timecardFormSchema = z.object({
  contractorId: z.number(),
  purchaseOrderId: z.number({ required_error: "Purchase order is required" }),
  date: z.string(),
  hours: z.number().min(0.1).max(24, "Hours must be between 0.1 and 24"),
  taskDescription: z.string().min(5, "Task description must be at least 5 characters"),
  hourlyRate: z.number().min(0),
});

type TimecardFormValues = z.infer<typeof timecardFormSchema>;

export function ContractorTimecardCreatePage() {
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<{ id: number }>();

  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<Timecard, HttpError, TimecardFormValues>({
    resolver: zodResolver(timecardFormSchema),
    defaultValues: {
      contractorId: identity?.id || 0,
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      taskDescription: "",
      hourlyRate: 0,
    },
    refineCoreProps: {
      resource: "timecards",
      action: "create",
      redirect: "list",
    },
  });

  const { options: poOptions } = useSelect<PurchaseOrder>({
    resource: "purchase_orders",
    optionLabel: "poNumber",
    optionValue: "id",
    filters: [{ field: "status", operator: "eq", value: "Active" }],
  });

  function onSubmit(values: TimecardFormValues) {
    onFinish(values);
  }

  return (
    <CreateView>
      <CreateViewHeader title="Submit Timecard" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 max-w-2xl">
          <FormField
            control={form.control}
            name="purchaseOrderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Order</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {poOptions?.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
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
                  <Textarea placeholder="Describe the work performed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate("/contractor-portal/timecards")}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Submitting..." : "Submit Timecard"}
            </Button>
          </div>
        </form>
      </Form>
    </CreateView>
  );
}
