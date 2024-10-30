import {cn} from "~/lib/utils";

export interface NewLoaderProps {
  containerClassName?: string;
  textClassName?: string;
  loaderClassName?: string;
}

export const NewLoader = ({containerClassName, textClassName, loaderClassName}: NewLoaderProps) => {
  return (
    <div className={cn("newLoader", containerClassName)}>
      <span className={cn("newLoader-text", textClassName)}>Loading...</span>
      <span className={cn("newLoad", loaderClassName)}></span>
    </div>
  )
}