
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BackupRecord } from "@/types/types";

const formSchema = z.object({
  date: z.date({
    required_error: "Tanggal diperlukan",
  }),
  time: z.string().min(1, { message: "Jam backup diperlukan" }),
  backupNumber: z.string().min(1, { message: "Nomor backup diperlukan" }),
  performer: z.string().min(1, { message: "Nama pelaksana diperlukan" }),
});

interface LogbookFormProps {
  onSubmit: (data: Omit<BackupRecord, "id" | "month">) => void;
  editRecord: BackupRecord | null;
  onCancel: () => void;
}

const LogbookForm: React.FC<LogbookFormProps> = ({ onSubmit, editRecord, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      time: "",
      backupNumber: "",
      performer: "",
    },
  });

  useEffect(() => {
    if (editRecord) {
      form.reset({
        date: new Date(editRecord.date),
        time: editRecord.time,
        backupNumber: editRecord.backupNumber,
        performer: editRecord.performer,
      });
    }
  }, [editRecord, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      date: values.date.toISOString(),
      time: values.time,
      backupNumber: values.backupNumber,
      performer: values.performer,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 border rounded-md bg-white">
        <h2 className="text-xl font-bold mb-4">{editRecord ? "Edit Catatan Backup" : "Tambah Catatan Backup"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Backup</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 14:30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="backupNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backup Ke</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="performer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pelaksana</FormLabel>
                <FormControl>
                  <Input placeholder="Nama pelaksana" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit">{editRecord ? "Perbarui" : "Simpan"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default LogbookForm;
