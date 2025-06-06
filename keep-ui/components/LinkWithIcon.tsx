import { AnchorHTMLAttributes, ReactNode, useState } from "react";
import Link, { LinkProps } from "next/link";
import { IconType } from "react-icons/lib";
import { Badge, Icon } from "@tremor/react";
import { usePathname } from "next/navigation";
import { Trashcan } from "@/components/icons";
import clsx from "clsx";
import { ShortNumber } from "./ui";

type LinkWithIconProps = {
  children: ReactNode;
  icon: IconType;
  count?: number;
  isBeta?: boolean;
  isDeletable?: boolean;
  onDelete?: () => void;
  className?: string;
  testId?: string;
  isExact?: boolean;
  iconClassName?: string;
  renderBeforeCount?: () => JSX.Element | undefined;
} & LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export const LinkWithIcon = ({
  icon,
  children,
  tabIndex = 0,
  count,
  isBeta = false,
  isDeletable = false,
  onDelete,
  className,
  testId,
  isExact = false,
  iconClassName,
  renderBeforeCount,
  ...restOfLinkProps
}: LinkWithIconProps) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isExact
    ? decodeURIComponent(pathname || "") === restOfLinkProps.href?.toString()
    : decodeURIComponent(pathname || "").startsWith(
        restOfLinkProps.href?.toString() || ""
      );

  const iconClasses = clsx(
    "group-hover:text-orange-400",
    {
      "text-orange-400": isActive,
      "text-black": !isActive,
    },
    iconClassName
  );

  const textClasses = clsx("truncate", {
    "text-orange-400": isActive,
    "text-black": !isActive,
  });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (restOfLinkProps.onClick) {
      restOfLinkProps.onClick(e);
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between py-0.5 px-1 font-medium rounded-lg focus:ring focus:ring-orange-300 group w-full min-w-0",
        {
          "bg-stone-200/50": isActive,
          "hover:bg-stone-200/50": !isActive,
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        tabIndex={tabIndex}
        {...restOfLinkProps}
        className="flex items-center space-x-1 flex-1 min-w-0"
        onClick={onClick}
        data-testid={`${testId}-link`}
      >
        <Icon className={iconClasses} icon={icon} />
        <span className={textClasses}>{children}</span>
      </Link>
      <div className="flex items-center">
        {count !== undefined && count !== null && (
          <Badge
            size="xs"
            color="orange"
            data-testid={`${testId}-badge`}
            className="px-1 mr-0.5 min-w-5"
          >
            <div className="flex gap-1 items-center">
              {renderBeforeCount && renderBeforeCount() && (
                <span>{renderBeforeCount()}</span>
              )}
              <ShortNumber value={count}></ShortNumber>
            </div>
          </Badge>
        )}
        {isBeta && (
          <Badge color="orange" size="xs" className="ml-1">
            Beta
          </Badge>
        )}
        {isDeletable && onDelete && (
          <button
            onClick={onDelete}
            className={`flex items-center text-slate-400 hover:text-red-500 p-0`}
          >
            <Trashcan className="text-slate-400 hover:text-red-500 group-hover:block hidden h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
