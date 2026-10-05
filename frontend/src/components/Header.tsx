"use client";

import { 
    AppBar, Drawer, IconButton, Toolbar, Typography, List, 
    ListItemButton, ListItemIcon, ListItemText, Box
} from "@mui/material";
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
    let [drawerVisible, setDrawerVisible] = useState<boolean>(true);

    const toggleDrawer = () => {
        setDrawerVisible(prevState => !prevState)
    }

    return (<Box sx={{display: "flex", flexDirection: "column", minHeight: '100vh'}}>
        <AppBar position="static">
          <Toolbar variant="dense">
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
          </Toolbar>
        </AppBar>
        <Box sx={{display: "flex", flexGrow: 1}}>
            <Drawer 
                variant="persistent" 
                open={drawerVisible}
                sx={{
                    '& .MuiDrawer-paper': {
                        position: 'relative',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box',
                    }
                }}
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
            </Drawer>
            <Box sx={{display: "flex", flexGrow: 1}}>
                {children}
            </Box>
        </Box>
    </Box>
    );
}