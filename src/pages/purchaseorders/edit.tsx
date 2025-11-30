import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import type { PurchaseOrder, Buyer } from "../../types";

const poFormSchema = z.object({
  poNumber: z.string().min(1, { message: "PO Number is required" }),
  totalAmount: z.coerce
    .number({ required_error: "Total amount is required" })
    .positive("Total amount must be positive"),
  amountRemaining: z.coerce.number(),
  amountSpent: z.coerce.number(),
  grAmount: z.coerce.number(),
  grBalance: z.coerce.number(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  status: z.enum(["Draft", "Pending", "Active", "Completed", "Cancelled"], {
    required_error: "Please select a status",
  }),
  type: z.enum(["Time and Materials", "Fixed Fee"], {
    required_error: "Please select a type",
  }),
  departmentId: z.coerce.number({ required_error: "Department is required" }),
  buyerId: z.coerce.number().optional(),
  tpscStatus: z.enum(["Not Started", "In Progress", "Completed"], {
    required_error: "TPSC status is required",
  }),
  fiscalYear: z.string().min(1, { message: "Fiscal year is required" }),
  fiscalPeriod: z.string().min(1, { message: "Fiscal period is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

type POFormValues = z.infer<typeof poFormSchema>;

export function EditPurchaseOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    refineCore: { onFinish, formLoading, queryResult },
    ...form
  } = useForm<PurchaseOrder, HttpError, POFormValues>({
    resolver: zodResolver(poFormSchema),
    defaultValues: {
      poNumber: "",
      totalAmount: 0,
      amountRemaining: 0,
      amountSpent: 0,
      grAmount: 0,
      grBalance: 0,
      startDate: "",
      endDate: "",
      status: "Draft",
      type: "Time and Materials",
      departmentId: undefined,
      buyerId: undefined,
      tpscStatus: "Not Started",
      fiscalYear: "",
      fiscalPeriod: "",
      description: "",
    },
    refineCoreProps: {
      resource: "purchase_orders",
      action: "edit",
      id: id,
      redirect: "show",
    },
  });

  const { options: departmentOptions } = useSelect({
    resource: "departments",
    optionValue: "id",
    optionLabel: "name",
  });

  const { options: buyerOptions } = useSelect<Buyer>({
    resource: "buyers",
    optionValue: "id",
    optionLabel: (item) => `${item.firstName} ${item.lastName}`,
  });

  function onSubmit(values: POFormValues) {
    const poData = {
      ...values,
      updatedAt: new Date().toISOString(),
    };
    onFinish(poData);
  }

  return (
    <EditView>
      <EditViewHeader title={`Edit Purchase Order #${id}`} />
      <LoadingOverlay loading={formLoading || queryResult?.isLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PO Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PO-2024-0001" {...field} />
                    </FormControl>
                    <FormDescription>Unique purchase order identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GR Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Goods Receipt authorization amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GR Balance ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Remaining GR authorization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amountRemaining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remaining Funds ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amountSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spent Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buyerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                      value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select buyer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {buyerOptions?.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Responsible for approval routing</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentOptions?.map((option: { value: string | number; label: string }) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fiscalYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiscal Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fiscalPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiscal Period</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Q1">Q1</SelectItem>
                        <SelectItem value="Q2">Q2</SelectItem>
                        <SelectItem value="Q3">Q3</SelectItem>
                        <SelectItem value="Q4">Q4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>For year-end closing compliance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PO Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Time and Materials">Time and Materials</SelectItem>
                        <SelectItem value="Fixed Fee">Fixed Fee</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tpscStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TPSC Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select TPSC status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Temporary Personnel Services Engagement</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter purchase order description and purpose"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/purchase-orders/${id}`)}
                disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </EditView>
  );
}
