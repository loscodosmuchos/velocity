import { useGetIdentity, useOne } from "@refinedev/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Briefcase } from "lucide-react";
import type { Contractor } from "@/types";

export function ContractorProfilePage() {
  const { data: identity } = useGetIdentity<{ id: number }>();

  const { data: contractorData } = useOne<Contractor>({
    resource: "contractors",
    id: identity?.id,
    queryOptions: { enabled: !!identity?.id },
  });

  const contractor = contractorData?.data;

  if (!contractor) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">View your contractor information and contract terms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">First Name</p>
              <p className="font-medium">{contractor.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="font-medium">{contractor.lastName}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{contractor.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{contractor.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{contractor.location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Contract Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Job Description</p>
            <p className="font-medium">{contractor.jobDescription}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="font-medium text-lg">${contractor.payRate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{new Date(contractor.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              variant={
                contractor.status === "Active" ? "default" : contractor.status === "Inactive" ? "secondary" : "outline"
              }>
              {contractor.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">PO Funds Remaining</p>
            <p className="font-medium text-lg">${contractor.poFundsRemaining.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need to Update Your Information?</CardTitle>
          <CardDescription>
            Contact your manager or HR to request changes to your profile or contract terms
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
