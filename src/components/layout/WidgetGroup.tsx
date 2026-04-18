import { PropsWithChildren } from "react";

interface Props {}

export default function WidgetGroup({ children }: PropsWithChildren<Props>) {
  return <div className="grid grid-cols-3 grid-rows-2 gap-4">{children}</div>;
}
