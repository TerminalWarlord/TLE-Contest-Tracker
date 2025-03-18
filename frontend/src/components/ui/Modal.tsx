import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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