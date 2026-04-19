import { PropsWithChildren } from "react";

import { Text } from "../ui/text";

interface Props {
  title: string;
  subtitle?: string;
  upperMetaContent?: React.ReactNode;
  lowerMetaContent?: React.ReactNode;
}

export default function Card({
  title,
  subtitle,
  upperMetaContent,
  lowerMetaContent,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="bg-foreground/5 hover:bg-foreground/8 grid h-full grid-cols-3 gap-12 rounded-xl p-10 transition-all duration-300">
      <div className="col-span-1 flex flex-col items-start justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <Text className="text-3xl font-medium tracking-tight">{title}</Text>
          <Text className="text-base font-normal tracking-tight opacity-60">
            {subtitle}
          </Text>
        </div>

        <div className="w-full">
          {upperMetaContent}
          {Boolean(upperMetaContent) && Boolean(lowerMetaContent) && (
            <div className="bg-foreground/10 my-2 h-px w-full" />
          )}
          {lowerMetaContent}
        </div>
      </div>
      <div className="col-span-2">{children}</div>
    </div>
  );
}
