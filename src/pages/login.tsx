import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"

const FormSchema = z.object({
    email: z.string({ error: "Email is required" }).email("Invalid email address"),
    password: z.string({ error: "Password is required" }).min(1, "Password is required"),
})

export default function InputForm() {

    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: 'anik.wdev@gmail.com',
            password: '12345678',
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true)
        await login(data.email, data.password)
        setIsLoading(false)
    }

    return (
        <div className="mt-8 flex-col items-center justify-center lg:flex">
            <Card className="w-11/12 mx-auto lg:w-1/3">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="cursor-pointer" disabled={isLoading}>Submit</Button>
                            <p>Don't have an account? <Link to="/register">Register</Link></p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

    )
}
