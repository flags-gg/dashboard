"use client"

import {type Session} from "next-auth";
import {type Flag} from "~/lib/statemanager";
import {useState} from "react";
import {Button} from "~/components/ui/button";
import {Trash2} from "lucide-react";
import {LoadingSpinner} from "~/components/ui/loader";

async function deleteFlagAction(session: Session, flag_id: string): Promise<null | Error> {
    return null
}

export function DeleteFlag({session, flag}: {session: Session, flag: Flag}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);

    const deleteFlag = async () => {
        try {
            setLoading(true);
            await deleteFlagAction(session, flag.details.id);
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
        <Button onClick={deleteFlag} asChild size={'icon'} variant={"outline"} className={"bg-muted/10 border-0 cursor-pointer"}>
            <Trash2 className={"h-5 w-5"} />
        </Button>
    )
}