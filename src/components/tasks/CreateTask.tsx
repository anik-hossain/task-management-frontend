import { FC, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateTaskMutation, useGetTasksQuery } from '@/store/services/taskApi';
import { useParams } from 'react-router-dom';

type Assignee = {
    id: string;
    name: string;
    email: string;
}

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    members: Assignee[]
}

const CreateTask: FC<Props> = ({ isOpen, setIsOpen, members }) => {
    const { projectId } = useParams<{ projectId: string }>();
    const [openCal1, setOpenCal1] = useState(false);
    const [openCal2, setOpenCal2] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [createTask] = useCreateTaskMutation();
    const { refetch: refetchTasks } = useGetTasksQuery(projectId || '', { skip: !projectId });

    const FormSchema = z.object({
        title: z.string({ error: "Title is required" }),
        assignee: z.string().nonempty({ message: "Assignee is required" }), // single value now
        description: z.string().optional(),
        priority: z.string().optional(),
        startDate: z.string({ error: "Start date is required" }),
        endDate: z.string({ error: "End date is required" }),
        dependencies: z.array(z.string()).optional(),
    });

    const dependencies = [
        { id: "1", label: "Design Homepage" },
        { id: "2", label: "Setup Database" },
        { id: "3", label: "API Integration" },
    ] as const;
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            assignee: "", // single value
            description: "",
            priority: "low",
            startDate: undefined,
            endDate: undefined,
            dependencies: [],
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setIsSubmitting(true);
            console.log(data);

            await createTask({id: projectId, body: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                status: 'pending',
                assigneeId: Number(data.assignee),
                startDate: new Date(data.startDate),
                dueDate: new Date(data.endDate),
                dependencies: data.dependencies?.map(item => Number(item)),
            }}).unwrap();
            setIsOpen(false);
            refetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[720px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <DialogDescription>Fill in details below.</DialogDescription>
                        </DialogHeader>

                        {/* Title & Assignee */}
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                                control={form.control}
                                name="assignee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignee</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full justify-between">
                                                {field.value
                                                    ? members.find(person => person.id == field.value)?.name || "Unknown"
                                                    : "Select assignee"}
                                                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {members.map(person => (
                                                    <SelectItem key={person.id} value={person.id}>
                                                        {person.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* Description & Priority */}
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="priority" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Start & End Date */}
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Popover open={openCal1} onOpenChange={setOpenCal1}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="justify-between font-normal">
                                                    {field.value ? new Date(field.value).toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => {
                                                        field.onChange(date?.toISOString() || '');
                                                        setOpenCal1(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="endDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Popover open={openCal2} onOpenChange={setOpenCal2}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="justify-between font-normal">
                                                    {field.value ? new Date(field.value).toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => {
                                                        field.onChange(date?.toISOString() || '');
                                                        setOpenCal2(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Dependencies */}
                        <FormField control={form.control} name="dependencies" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base mb-2">Dependencies</FormLabel>
                                {dependencies.map(item => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    // @ts-ignore
                                                    field.onChange([...field.value, item.id]);
                                                } else {
                                                    field.onChange(field.value?.filter(id => id !== item.id));
                                                }
                                            }}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTask;
