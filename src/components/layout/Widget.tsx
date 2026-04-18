import { PropsWithChildren } from "react";

import { Text } from "../ui/text";

interface Props {
  icon: React.ReactNode;
  label: string;
}

export default function Widget({
  icon,
  label,
  children,
}: PropsWithChildren<Props>) {
  return (
    <button className="bg-foreground/5 hover:bg-foreground/8 text-foreground flex flex-col items-start justify-between gap-4 rounded-xl p-8 transition-colors duration-300">
      <div className="flex size-12 items-center justify-center">{icon}</div>

      <Text className="text-2xl font-medium">{label}</Text>
    </button>
  );
}
