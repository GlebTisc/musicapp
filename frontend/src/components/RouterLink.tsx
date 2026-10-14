import Link from "next/link";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";

type RouterLinkProps = MuiLinkProps & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>
};

function RouterLink({href, ref, ...props}: RouterLinkProps) {
    return (
        <MuiLink
            ref={ref}
            href={href}
            component={Link}
            {...props}
        />
    );
}

RouterLink.displayName = "RouterLink";
export default RouterLink;