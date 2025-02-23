import { type StyleFetch, type StyleState } from "~/app/(dashboard)/secretmenu/[menu_id]/styling/context";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { commitHashAtom } from "~/lib/statemanager";
import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const fetchStyles = async (menuId: string): Promise<StyleFetch> => {
  const user = await currentUser();
  if (!user) {
    throw new Error('No user found')
  }

  const response = await fetch(`/api/secretmenu/style`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user?.id,
      menuId: menuId,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to get style")
  }

  return await response.json() as StyleFetch
}

const transformStyles = (data: StyleFetch): { styles: StyleState; id: string } => {
  const transformedStyles: StyleState = {} as StyleState;

  data.styles.forEach((style) => {
    transformedStyles[style.name] = JSON.parse(style.value);
  });

  return {
    styles: transformedStyles,
    id: data.style_id,
  };
}

export const useStyles = (menuId: string) => {
  const [commitHash] = useAtom(commitHashAtom)
  const {user} = useUser();
  if (!user) {
    throw new Error('No user found')
  }

  return useQuery<{ styles: StyleState; id: string }, Error>({
    queryKey: ["styles", menuId, user?.id, commitHash],
    queryFn: async () => {
      const data = await fetchStyles(menuId);
      return transformStyles(data);
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
  })
}