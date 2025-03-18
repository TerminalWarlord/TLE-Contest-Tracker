import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editContestYoutubeUrl } from "@/lib/http/contests";
import { Button } from "./button";
import { ReactNode } from "react";


const Modal: React.FC<{ isOpen: boolean, handleModal: () => void, children: ReactNode }> = ({ isOpen, handleModal, children }) => {
    return (
        <Dialog open={isOpen} onOpenChange={handleModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Contest</DialogTitle>
                    <DialogDescription>
                        Make changes to the contest here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                {children}
                
            </DialogContent>
        </Dialog>
    )
}

export default Modal