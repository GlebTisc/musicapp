import { useAuth } from "@/hooks/auth";
import { AccountCircle, Checklist, Logout } from "@mui/icons-material";
import { Button, ClickAwayListener, Divider, Grow, ListItemIcon, MenuItem, MenuList, Paper, Popper, Stack, Typography } from "@mui/material";
import ButtonOutline from "../ButtonOutline";
import Link from "next/link";
import FieldSkeleton from "../skeletons/FieldSkeleton";
import { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { mainTheme } from "@/themes/theme";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function ProfileButton() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    // ref to return focus to
    const prevOpen = useRef(open);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (e: Event | SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(e.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false && anchorRef.current) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleLogout = async (e: Event | SyntheticEvent) => {
        // close menu
        handleClose(e);
        await dispatch(logout());
        router.replace('/');
    }

    return isLoading
        ? <FieldSkeleton variant="text" height="32px" sx={{ minWidth: "50px" }} />
        : (
            isAuthenticated
                ? (
                    <>
                        <Button
                            ref={anchorRef}
                            id="account-button"
                            onClick={handleToggle}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open}
                            sx={{
                                textTransform: "none",
                                '&:hover': {
                                    bgcolor: mainTheme.palette.primary.light
                                }
                            }}
                        >
                            <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
                                <AccountCircle fontSize="medium" />
                                <Typography component="h6" sx={{ color: mainTheme.palette.text.primary }}>
                                    {user?.username}
                                </Typography>
                            </Stack>
                        </Button>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom-start' ? 'left top' : 'left bottom'
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList
                                                autoFocusItem={open}
                                                id="composition-menu"
                                                aria-labelledby="composition-button"
                                                onKeyDown={handleListKeyDown}
                                            >
                                                {user?.role === 'admin' &&
                                                    <MenuItem component={Link} href="/admin" onClick={handleClose}>
                                                        <ListItemIcon>
                                                            <Checklist />
                                                        </ListItemIcon>
                                                        <Typography>
                                                            Admin
                                                        </Typography>
                                                    </MenuItem>
                                                }
                                                <Divider />
                                                <MenuItem onClick={handleLogout}>
                                                    <ListItemIcon>
                                                        <Logout />
                                                    </ListItemIcon>
                                                    <Typography>
                                                        Logout
                                                    </Typography>
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </>
                )
                : (
                    <ButtonOutline component={Link} href="/login">
                        Login
                    </ButtonOutline>
                )
        );
}