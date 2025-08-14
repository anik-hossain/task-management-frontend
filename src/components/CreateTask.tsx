import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import apiService from '@/utils/api';
import { AppDispatch } from '@/store';
import { createTask, fetchTasks } from '@/store/slices/taskSlice';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

type Assignee = {
    id: string;
    name: string;
    email: string;
}

const CreateTask: FC<Props> = ({ isOpen, setIsOpen }) => {

    const dispatch = useDispatch<AppDispatch>();
    const [openCal1, setOpenCal1] = useState(false)
    const [openCal2, setOpenCal2] = useState(false)
    const [assignees, setAssignees] = useState<Assignee[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const FormSchema = z.object({
        title: z.string({ error: "Title is required" }),
        assignee: z.array(z.any()).nonempty({ message: "At least one assignee is required" }),
        description: z.string().optional(),
        priority: z.string().optional(),
        startDate: z.string({ error: "Start date is required" }),
        endDate: z.string({ error: "End date is required" }),
        dependencies: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    })

    const dependencies = [
        {
            id: "1",
            label: "Design Homepage",
        },
        {
            id: "2",
            label: "Home",
        },
        {
            id: "2",
            label: "Setup Database",
        },
        {
            id: "3",
            label: "API Integration",
        },
    ] as const

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: undefined,
            assignee: [],
            description: undefined,
            priority: 'low',
            endDate: undefined,
            startDate: undefined,
            dependencies: []
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setIsSubmitting(true);
            const resultAction = await dispatch(createTask({
                title: data.title,
                description: data.description,
                priority: data.priority,
                status: 'pending',
                assignee: data.assignee,
                start_date: data.startDate,
                end_date: data.endDate,
            }));

            if (createTask.fulfilled.match(resultAction)) {
                setIsOpen(false);
                dispatch(fetchTasks());
            } else {
                console.error('Task creation failed:', resultAction.payload);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }finally{
            setIsSubmitting(false);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchAssignees = await apiService.get('/users') as Assignee[];
                setAssignees(fetchAssignees);
            } catch (error) {
                console.error('Error fetching assignees:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[720px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <DialogDescription>Fill in details below.</DialogDescription>
                        </DialogHeader>

                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Title" {...field} value={field.value} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assignee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignees</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {field.value.length > 0
                                                        ? `${field.value.length} selected`
                                                        : "Select assignees"}
                                                    <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <div className="max-h-[200px] overflow-y-auto">
                                                    {assignees.map((person) => {
                                                        const isSelected = field.value.includes(person.id);
                                                        return (
                                                            <div
                                                                key={person.id}
                                                                className="flex cursor-pointer items-center space-x-2 px-3 py-2 hover:bg-accent"
                                                                onClick={() => {
                                                                    if (isSelected) {
                                                                        field.onChange(
                                                                            field.value.filter((id) => id !== person.id)
                                                                        );
                                                                    } else {
                                                                        field.onChange([...field.value, person.id]);
                                                                    }
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            field.onChange([...field.value, person.id]);
                                                                        } else {
                                                                            field.onChange(
                                                                                field.value.filter((id) => id !== person.id)
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="text-sm">{person.name}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
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
                            )}
                        />
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-3">
                                                <Popover open={openCal1} onOpenChange={setOpenCal1}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="justify-between font-normal"
                                                        >
                                                            {field.value ? new Date(field.value).toLocaleDateString() : "Select date"}
                                                            <ChevronDownIcon />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            captionLayout="dropdown"
                                                            onSelect={(date) => {
                                                                field.onChange(date?.toISOString() || '');
                                                                setOpenCal1(false)
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-3">
                                                <Popover open={openCal2} onOpenChange={setOpenCal2}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="justify-between font-normal"
                                                        >
                                                            {field.value ? new Date(field.value).toLocaleDateString() : "Select date"}
                                                            <ChevronDownIcon />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            captionLayout="dropdown"
                                                            onSelect={(date) => {
                                                                field.onChange(date?.toISOString() || '');
                                                                setOpenCal2(false)
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="dependencies"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Dependencies</FormLabel>
                                    </div>
                                    {dependencies.map((item, index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name="dependencies"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-center gap-2"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">
                                                            {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className='cursor-pointer'>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className='cursor-pointer' disabled={isSubmitting}>Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    );
}

export default CreateTask;
