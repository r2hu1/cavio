"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import SharedLogo from "@/components/shared-logo";
import { Loader } from "@/components/ui/loader";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import SocialSignInButton from "./social-signin-view";

const formSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
	firstName: z
		.string()
		.min(4, { message: "First name must be at least 4 characters long" })
		.max(100, { message: "First name must be at most 100 characters long" }),
	lastName: z
		.string()
		.min(4, { message: "Last name must be at least 4 characters long" })
		.max(100, { message: "Last name must be at most 100 characters long" }),
});

export default function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const searchParams = new URLSearchParams(window.location.search);
		const { error } = await signUp.email({
			name: `${values.firstName} ${values.lastName}`,
			email: values.email,
			password: values.password,
			callbackURL: `/auth/verify-email${searchParams.get("redirect") && `?redirect=${searchParams.get("redirect")}`}`,
		});

		if (error) {
			toast.error(error.message);
		} else {
			router.push("/auth/verify-email");
		}

		setIsLoading(false);
	}

	return (
		<div className="flex flex-col items-center justify-center gap-6">
			<SharedLogo />
			<div className={cn("flex flex-col gap-6 max-w-sm", className)} {...props}>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Create Account</CardTitle>
						<CardDescription>
							Continue with your social accounts
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<div className="grid gap-6">
									<div className="grid grid-cols-2 gap-4">
										<SocialSignInButton disabled={isLoading} type="google" />
										<SocialSignInButton disabled={isLoading} type="github" />
									</div>
									<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
										<span className="bg-card text-muted-foreground relative z-10 px-2">
											Or continue with
										</span>
									</div>
									<div className="grid gap-6">
										<div className="grid grid-cols-2 gap-3">
											<div className="grid gap-3">
												<FormField
													control={form.control}
													name="firstName"
													render={({ field }) => (
														<FormItem>
															<FormLabel>First Name</FormLabel>
															<FormControl>
																<Input placeholder="John" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<div className="grid gap-3">
												<FormField
													control={form.control}
													name="lastName"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Last Name</FormLabel>
															<FormControl>
																<Input placeholder="Deo" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
										<div className="grid gap-3">
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input
																placeholder="name@example.com"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="grid gap-3">
											<div className="flex flex-col gap-2">
												<FormField
													control={form.control}
													name="password"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Password</FormLabel>
															<FormControl>
																<Input
																	placeholder="********"
																	{...field}
																	type="password"
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
										<Button
											type="submit"
											className="w-full"
											disabled={isLoading}
										>
											{isLoading ? <Loader className="size-4" /> : "Continue"}
										</Button>
									</div>
									<div className="text-center text-sm">
										Already have an account?{" "}
										<Link
											href="/auth/sign-in"
											className="underline underline-offset-4"
										>
											Sign In
										</Link>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
				<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
					By clicking continue, you agree to our{" "}
					<Link href="#">Terms of Service</Link> and{" "}
					<Link href="#">Privacy Policy</Link>.
				</div>
			</div>
		</div>
	);
}
