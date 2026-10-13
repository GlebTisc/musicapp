"use client";

import { 
    AppBar, IconButton, Toolbar, Typography, List,
    ListItemButton, ListItemIcon, ListItemText, Box, useMediaQuery
} from "@mui/material";
import HeaderDrawer from "./HeaderDrawer";
import SearchBar from "./SearchBar";
import ProfileButton from "./ProfileButton";
import { mainTheme } from "@/themes/theme";
import { HomeFilled, Menu, SvgIconComponent } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

const sideMenuItems: SideMenuItem[] = [
    {
        label: "Home",
        href: "/",
        icon: HomeFilled
    } 
];

interface SideMenuItem {
  label: string,
  href: string,
  icon: SvgIconComponent | undefined
}

export default function Header({children}: {children: React.ReactNode})
{
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [desktopOpen, setDesktopOpen] = useState<boolean>(true);
    const [isDrawerClosing, setIsDrawerClosing] = useState<boolean>(false);

    const isDesktop = useMediaQuery(mainTheme.breakpoints.up('md'));

    const isDrawerOpen = isDesktop ? desktopOpen : mobileOpen;

    const toggleDrawer = () => {
        if (!isDrawerClosing) {
            isDesktop
                ? setDesktopOpen(prev => !prev)
                : setMobileOpen(prev => !prev);
            setIsDrawerClosing(true);
        }
    };

    const onTransitionEnd = () => {
        setIsDrawerClosing(false);
    };

    return (<Box sx={{display: "flex", flexDirection: "column", minHeight: '100vh'}}>
        <AppBar position="static">
            <Toolbar variant="dense" sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <Box component="div" sx={{
                    minWidth: "200px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <IconButton 
                        size="large"
                        edge="start"
                        color="inherit"
                        onClick={toggleDrawer}
                    >
                        <Menu />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                    >
                        CloudMusic
                    </Typography>
                </Box>
                <SearchBar />
                <ProfileButton />
            </Toolbar>
        </AppBar>
        <Box sx={{display: "flex", flexGrow: 1}}>
            <HeaderDrawer
                isDesktop = {isDesktop}
                isOpen = {isDrawerOpen}
                onClose={() => {
                    setMobileOpen(false);
                    setIsDrawerClosing(true);
                }}
                onTransitionEnd={onTransitionEnd}
            >
                <List>
                    {
                        sideMenuItems.map((item: SideMenuItem) => (
                            <ListItemButton key={item.label} LinkComponent={Link} href={item.href}>
                                {item.icon && <ListItemIcon> <item.icon /> </ListItemIcon>}
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))
                    }
                </List>
            </HeaderDrawer>
            <Box sx={{display: "flex", flexGrow: 1}}>
                {children}
            </Box>
        </Box>
    </Box>
    );
}