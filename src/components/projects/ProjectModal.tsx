import { FC, useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import apiService from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { useCreateProjectMutation } from '@/store/services/projectApi';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CreateTask: FC<Props> = ({ isOpen, setIsOpen }) => {
    const [assignees, setAssignees] = useState<any[]>([]);
    const [openCal1, setOpenCal1] = useState(false);
    const [openCal2, setOpenCal2] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth()
    const [createProject] = useCreateProjectMutation();

    const FormSchema = z.object({
        name: z.string({ error: "Title is required" }),
        description: z.string().optional(),
        startDate: z.string({ error: "Start date is required" }),
        endDate: z.string({ error: "End date is required" }),
        members: z.array(z.any()).nonempty({ message: "At least one assignee is required" }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: undefined,
            startDate: "",
            endDate: "",
            members: [],
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            setIsSubmitting(true);
            await createProject({ ownerId: user?.id, ...data }).unwrap();
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsSubmitting(false);
            setIsOpen(false);
            form.reset();
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchAssignees = await apiService.get('/users') as any[];
                // remove auth user from the list
                const filtered = fetchAssignees.filter(p => p.id !== user?.id);
                setAssignees(filtered);

                // ensure form value doesn't include auth user
                form.setValue(
                    "members",
                    form.getValues("members").filter(id => id !== user?.id)
                );
            } catch (error) {
                console.error('Error fetching assignees:', error);
            }
        };
        fetchData();
    }, [user?.id]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[720px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>Fill in details below.</DialogDescription>
                        </DialogHeader>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
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
                        <FormField control={form.control} name="members" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assignees</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {field.value.length > 0 ? `${field.value.length} selected` : "Select assignees"}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                        <div className="max-h-[200px] overflow-y-auto">
                                            {assignees.map(person => {
                                                const isSelected = field.value.includes(person.id);
                                                return (
                                                    <div
                                                        key={person.id}
                                                        className="flex cursor-pointer items-center space-x-2 px-3 py-2 hover:bg-accent"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                field.onChange(field.value.filter(id => id !== person.id));
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
                                                                    field.onChange(field.value.filter(id => id !== person.id));
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
