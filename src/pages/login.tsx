"use client"

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

const FormSchema = z.object({
    email: z.string({error: "Email is required"}).email("Invalid email address"),
    password: z.string({error: "Password is required"}).min(6, "Password must be at least 6 characters long"),
})

export default function InputForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: 'anik.wdev@gmail.com',
            password: '12345678',
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
          await apiService.post('/auth/login', data)
          toast("Logged in successfully.", {style: { background: '#4caf50', color: '#fff' }})
        } catch (error) {
            toast("Invalid credentials.", {style: { background: '#f44336', color: '#fff' }})
        }
    }

    return (
        <div className="mt-8 flex-col items-center justify-center h-screen lg:flex">
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
                            <Button type="submit" className="cursor-pointer">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

    )
}
