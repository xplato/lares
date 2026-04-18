import { PropsWithChildren } from "react";

import { Text } from "../ui/text";

interface Props {
  title: string;
}

export default function Section({ title, children }: PropsWithChildren<Props>) {
  return (
    <section className="flex w-full flex-col gap-12">
      <div className="w-full">
        <Text className="text-5xl font-medium tracking-tight">{title}</Text>
      </div>
      {children}
    </section>
  );
}
