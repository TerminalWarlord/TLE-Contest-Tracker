import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { getUserDetails, signIn, signUp } from "@/lib/http/auth"
import { useContext } from "react"
import { UserContext } from "@/store/user-context"


interface LoginFormProps extends React.ComponentProps<"div"> {
  mode: string;
}

export function LoginForm({
  mode,
  className,
  ...props
}: LoginFormProps) {
  const navigate = useNavigate();


  const userCtx = useContext(UserContext);

  const handleFormSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      if (mode === "login") {
        await signIn(new FormData(ev.target as HTMLFormElement));
        const data = await getUserDetails();
        if(data){
          userCtx.logIn(data.role);
        }
        navigate('/');

      }
      else {
        await signUp(new FormData(ev.target as HTMLFormElement));
        navigate('/auth/login');
      }
    }
    catch (err) {
      console.log(err);
    }

  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'login' ? "Login" : "Sign up"} to your account</CardTitle>
          <CardDescription>
            {mode === 'login' ? "Enter your email below to login to your account" : "Enter the details below to register"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>



              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                </div>
                <Input id="password" type="password" required name="password" />
              </div>

              {mode !== "login" && <>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <Input id="password2" type="password2" required name="password2" />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Name</Label>
                  </div>
                  <Input id="name" type="name" required name="name" />
                </div>
              </>}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {mode === "login" ? "Login" : "Signup"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {mode === "login" ? <>
                Don&apos;t have an account?{" "}
                <Link to="/auth/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </> : <>
                Already have an account?{" "}
                <Link to="/auth/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
