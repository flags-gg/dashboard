"use client"

import {type Flag} from "~/lib/statemanager";
import {useState} from "react";
import {Button} from "~/components/ui/button";
import {Trash2} from "lucide-react";
import {LoadingSpinner} from "~/components/ui/loader";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

async function deleteFlagAction(flag_id: string): Promise<null | Error> {
    try {
        const response = await fetch(`/api/flag/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                flag_id: flag_id,
            }),
            cache: "no-store",
        })
        if (!response.ok) {
            return new Error("Failed to delete flag")
        }

        return null
    } catch (e) {
        if (e instanceof Error) {
            return Error(`Failed to delete flag: ${e.message}`)
        } else {
            console.error("deleteFlag", e)
        }
    }

    return Error("Failed to delete flag")
}

export function DeleteFlag({flag}: {flag: Flag}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const deleteFlag = async () => {
        setLoading(true);

        try {
            deleteFlagAction(flag.details.id).then(() => {
                setLoading(false);
                router.refresh()
            }).catch((e) => {
                if (e instanceof Error) {
                    throw new Error(`Failed to delete flag: ${e.message}`);
                }
                throw new Error("Failed to delete flag");
            })
        } catch (e) {
            console.error("Error deleting flag", e);
            toast({
                title: "Failed to delete flag",
                description: "Failed to delete flag",
            })
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