import { type Session } from "next-auth";
import { type StyleFetch, type StyleState } from "~/app/(dashboard)/secretmenu/[menu_id]/styling/context";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { commitHashAtom } from "~/lib/statemanager";

const fetchStyles = async (session: Session, menuId: string): Promise<StyleFetch> => {
  const response = await fetch(`/api/secretmenu/style`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionToken: session.user.access_token,
      userId: session.user.id,
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

export const useStyles = (session: Session, menuId: string) => {
  const [commitHash] = useAtom(commitHashAtom)

  return useQuery<{ styles: StyleState; id: string }, Error>({
    queryKey: ["styles", menuId, session.user.id, commitHash],
    queryFn: async () => {
      const data = await fetchStyles(session, menuId);
      return transformStyles(data);
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
  })
}