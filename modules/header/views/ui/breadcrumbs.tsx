"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname.split("/").map((segment, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/${segment}`}>
                {segment.charAt(0).toUpperCase()}
                {segment.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index != 0 && index != pathname.split("/").length - 1 && (
              <BreadcrumbSeparator />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
