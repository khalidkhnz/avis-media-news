"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { AuthService, IInitialValuesType } from "@/api/auth.service";
import { useMachine } from "@/context/machine";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
}

function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { AUTHENTICATE } = useMachine();

  const router = useRouter();

  const initialValues: IInitialValuesType = {
    formType: "LOGIN",
    username: "",
    email: "",
    password: "",
  };

  const fk = useFormik({
    initialValues,
    async onSubmit(vals) {
      const response = await AuthService.handleAuthentication(vals);
      if (response.success) {
        AUTHENTICATE(response.token);
        router.push("/cms/dashboard");
      } else alert(response.message);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex flex-col gap-6">
              {fk.values.formType === "REGISTER" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Username</Label>
                  <Input
                    id="name"
                    name="username"
                    value={fk.values.username}
                    onChange={fk.handleChange}
                    type="name"
                    placeholder="Enter fullname"
                    required
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  value={fk.values.email}
                  onChange={fk.handleChange}
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                {fk.values.formType === "LOGIN" && (
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                )}
                <Input
                  name="password"
                  value={fk.values.password}
                  onChange={fk.handleChange}
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button onClick={() => fk.handleSubmit()} className="w-full">
                {fk.values.formType === "LOGIN" ? "Login" : "Sign up"}
              </Button>
            </div>
            <div
              className="cursor-pointer mt-4 text-center text-sm"
              onClick={() => {
                switch (fk.values.formType) {
                  case "LOGIN": {
                    fk.setFieldValue("formType", "REGISTER");
                    break;
                  }
                  case "REGISTER": {
                    fk.setFieldValue("formType", "LOGIN");
                    break;
                  }
                }
              }}
            >
              {fk.values.formType === "LOGIN"
                ? "Don't have an account? "
                : "Have account? "}
              <span className="underline underline-offset-4">
                {fk.values.formType === "LOGIN" ? "Sign up" : "Login"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
