"use client"

import {Button} from "~/components/ui/button";
import {type Flag} from "~/lib/statemanager";
import {type Session} from "next-auth";
import {Pencil} from "lucide-react";
import {useState} from "react";
import {LoadingSpinner} from "~/components/ui/loader";

async function editFlagAction(session: Session, flag_id: string): Promise<null | Error> {
    return null
}

export function EditFlag({session, flag}: {session: Session, flag: Flag}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);

    const editFlag = async () => {
        try {
            setLoading(true);
            await editFlagAction(session, flag.details.id);
            setSuccess(true);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.log("Error deleting flag", e);
        } finally {
            //setLoading(false);
        }
    }

    if (loading) {
        return (
            <Button asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0"} disabled={true}>
                <LoadingSpinner className={"h-5 w-5"} />
            </Button>
        )
    }

    return (
        <Button onClick={editFlag} asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer"}>
            <Pencil className={"h-5 w-5"} />
        </Button>
    )
}