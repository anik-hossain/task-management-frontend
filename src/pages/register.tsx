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
import apiService from "@/utils/api"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const FormSchema = z.object({
    name: z.string({error: "Name is required"}),
    email: z.string({error: "Email is required"}).email("Invalid email address"),
    password: z.string({error: "Password is required"}).min(6, "Password must be at least 6 characters long"),
})

export default function InputForm() {
    const { register } = useAuth()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: undefined,
            email: undefined,
            password: undefined,
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        register(data.name, data.email, data.password)
    }

    return (
        <div className="mt-8 flex-col items-center justify-center h-screen lg:flex">
            <Card className="w-11/12 mx-auto lg:w-1/3">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <Button type="submit" className="cursor-pointer">Submit</Button>
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

    )
}
