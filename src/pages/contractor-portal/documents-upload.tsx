import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity, type HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";
import { useNavigate } from "react-router";
import { UploadCloud } from "lucide-react";
import type { ContractorDocument } from "@/types";

const documentFormSchema = z.object({
  contractorId: z.number(),
  documentType: z.enum(["Certification", "Contract", "W9", "Insurance", "Background Check", "Other"]),
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().url().optional(),
  expirationDate: z.string().optional(),
  notes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export function UploadContractorDocumentPage() {
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<{ id: number }>();

  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<ContractorDocument, HttpError, DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      contractorId: identity?.id || 0,
      documentType: "Certification",
      fileName: "",
    },
    refineCoreProps: {
      resource: "contractor_documents",
      action: "create",
      redirect: "list",
    },
  });

  function onSubmit(values: DocumentFormValues) {
    onFinish(values);
  }

  return (
    <CreateView>
      <CreateViewHeader title="Upload Document" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 max-w-2xl">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, JPG, PNG
            </p>
            <Input type="file" className="mt-4" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
          </div>

          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="W9">W9 Form</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Background Check">Background Check</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Name</FormLabel>
                <FormControl>
                  <Input placeholder="Document name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  If this document has an expiration date (e.g., certification, insurance)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional notes about this document" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate("/contractor-portal/documents")}>
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </Form>
    </CreateView>
  );
}
