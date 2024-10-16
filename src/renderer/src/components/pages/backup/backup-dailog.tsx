import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { AlertDialogHeader } from '@renderer/components/ui/alert-dialog'
import { Label } from '@renderer/components/ui/label'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import SubmitIcon from '@renderer/components/icons/submit-icon'

export default function BackupDailog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709] text-white"
        >
          <i className="ml-2">
            <SubmitIcon />
          </i>
          أنشاء نسخة
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <AlertDialogHeader>
          <DialogTitle className="text-start">أنشاء نسخة جديدة</DialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-1 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              اسم النسخة
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              امتداد الملف
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button size={'lg'} variant="outline">
              إلغاء
            </Button>
          </DialogClose>
          <Button form="AddCustomerForm" className="bg-[#196cb0]" type="submit" size={'lg'}>
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
