import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Users } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

export function CreateUserPage() {
  const navigate = useNavigate();
  const { mutate: createUser, isLoading } = useCreate<User>();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Viewer" as User["role"],
    departmentId: undefined as number | undefined,
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createUser(
      {
        resource: "users",
        values: {
          ...formData,
          createdAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success("User created successfully");
          navigate("/admin/users");
        },
        onError: (error) => {
          toast.error("Failed to create user");
          console.error("Error creating user:", error);
        },
      }
    );
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/users")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          Create New User
        </h1>
        <p className="text-muted-foreground mt-2">
          Add a new user to the Velocity Workforce Management System
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Enter the details for the new user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john.doe@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Admin</Badge>
                      <span className="text-sm text-muted-foreground">Full system access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Manager">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Manager</Badge>
                      <span className="text-sm text-muted-foreground">Manage team and approvals</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Contractor">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Contractor</Badge>
                      <span className="text-sm text-muted-foreground">Submit timecards and expenses</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Viewer">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Viewer</Badge>
                      <span className="text-sm text-muted-foreground">Read-only access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select the appropriate role based on the user's responsibilities
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Select
                value={formData.departmentId?.toString()}
                onValueChange={(value) => handleInputChange("departmentId", parseInt(value))}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Engineering</SelectItem>
                  <SelectItem value="2">Sales</SelectItem>
                  <SelectItem value="3">Marketing</SelectItem>
                  <SelectItem value="4">Operations</SelectItem>
                  <SelectItem value="5">Finance</SelectItem>
                  <SelectItem value="6">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/users")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
